/* eslint-disable react-refresh/only-export-components -- TODO: move context helpers (non-component exports) to separate files */
import { createContext, useState, useEffect, useMemo, useCallback, useContext } from "react";
import normalizeRole from '@/utils/normalizeRole';
import { getAuth, signInWithCustomToken, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, browserLocalPersistence, signOut, setPersistence } from "firebase/auth";
import { app } from "../firebase-config.js";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const navigate = useNavigate();
	const auth = getAuth(app);
	setPersistence(auth, browserLocalPersistence);

	const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
	const LINKEDIN_CLIENT_ID = import.meta.env.VITE_LINKEDIN_CLIENT_ID || "YOUR_LINKEDIN_CLIENT_ID";

	const TOKEN_REFRESH_BUFFER = 5 * 60 * 1000; // 5 minutes buffer

	// Helper: parse role into array or null (no normalization) - keeps original spelling
	const parseRoles = (r) => {
		if (r == null) return null;
		if (Array.isArray(r)) return r;
		if (typeof r === "string") {
			// try JSON first
			try {
				const parsed = JSON.parse(r);
				if (Array.isArray(parsed)) return parsed;
				// if parsed is string (rare), fallthrough
			} catch (e) {
				// not JSON - continue
			}
			// handle CSV "job_seeker,employer"
			if (r.includes(",")) return r.split(",").map(s => s.trim()).filter(Boolean);
			// single role string -> return single-element array
			return [r.trim()];
		}
		// unexpected type -> null
		return null;
	};

	const [user, setUser] = useState(() => {
		try {
			const storedUser = localStorage.getItem("user");
			return storedUser ? JSON.parse(storedUser) : { role: null };
		} catch (e) {
			console.error("Failed to parse user from localStorage", e);
			return { role: null };
		}
	});

	// `roles` - canonical list stored in localStorage (persisted across tabs)
		const [roles, setRoles] = useState(() => {
			try {
				const raw = localStorage.getItem("roles") || localStorage.getItem("role");
				const parsed = parseRoles(raw);
				// Normalize each role string to canonical form
				return parsed && parsed.length ? parsed.map(r => normalizeRole(r)) : null;
		} catch (e) {
			console.error("Failed to parse roles from localStorage", e);
			return null;
		}
	});

	// `role` - active role for this tab. Stored in sessionStorage to allow multiple logged-in roles per browser.
		const [role, setRole] = useState(() => {
		try {
			const active = sessionStorage.getItem('activeRole');
			if (active) return active;
			const raw = localStorage.getItem("roles") || localStorage.getItem("role");
			const parsed = parseRoles(raw);
			const normalized = parsed && parsed.length ? parsed.map(p => normalizeRole(p)) : null;
			return normalized && normalized.length ? normalized[0] : null;
		} catch (e) {
			console.error('Failed to initialize active role from storage', e);
			return null;
		}
	});
	
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [fallbackMode, setFallbackMode] = useState(false);
	
	const storeTokens = (accessToken, refreshToken, userData, accessExpiresIn, refreshExpiresIn) => {
		localStorage.setItem("accessToken", accessToken);
		localStorage.setItem("refreshToken", refreshToken);
		localStorage.setItem("accessExpiresTime", (Date.now() + (accessExpiresIn * 1000)).toString());
		if (refreshExpiresIn) {
			localStorage.setItem("refreshExpiresTime", (Date.now() + (refreshExpiresIn * 1000)).toString());
		}
		
		if (userData) {
			const userWithRefreshToken = {
				...userData,
				refresh_token: refreshToken
			};
			localStorage.setItem("user", JSON.stringify(userWithRefreshToken));
			// store roles as JSON so arrays are preserved (backend may send array or CSV/string)
			const parsedRoles = parseRoles(userData?.role);
			const normalized = parsedRoles && parsedRoles.length ? parsedRoles.map(r => normalizeRole(r)) : null;
			localStorage.setItem("roles", JSON.stringify(normalized));
			localStorage.setItem("role", JSON.stringify(normalized)); // legacy
			// update in-memory roles and active role
			setRoles(normalized);
			const curActive = sessionStorage.getItem('activeRole');
			if (!curActive) {
				const defaultActive = normalized && normalized.length ? normalized[0] : null;
				if (defaultActive) {
					sessionStorage.setItem('activeRole', defaultActive);
					setRole(defaultActive);
				} else {
					setRole(null);
				}
			}
		}
	};

	const clearTokens = () => {
		localStorage.removeItem("accessToken");
		localStorage.removeItem("refreshToken");
		localStorage.removeItem("accessExpiresTime");
		localStorage.removeItem("refreshExpiresTime");
		localStorage.removeItem("user");
		localStorage.removeItem("role");
		localStorage.removeItem("roles");
		sessionStorage.removeItem('activeRole');
		localStorage.removeItem("persistentToken");
	};

	const refreshTokens = useCallback(async () => {
		try {
			const refreshToken = localStorage.getItem("refreshToken");
			if (!refreshToken) throw new Error("No refresh token available");
			
			const response = await fetch(`${apiUrl}/api/auth/refresh-token`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ refreshToken })
			});

			if (!response.ok) {
				const errorData = await response.json();
				if (response.status === 401) {
					clearTokens();
					setUser(null);
					setRole(null);
					navigate("/login");
				}
				throw new Error(errorData.message || "Token refresh failed");
			}

			const { accessToken, refreshToken: newRefreshToken, user, accessExpiresIn, refreshExpiresIn } = await response.json();
			storeTokens(accessToken, newRefreshToken, user, accessExpiresIn, refreshExpiresIn);
			return accessToken;
		} catch (error) {
			console.error("Refresh failed:", error);
			throw error;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [apiUrl, navigate]);

	const logout = useCallback(async () => {
		try {
			clearTokens();
			setUser(null);
			setRole(null);
			
			const token = localStorage.getItem("accessToken");
			if (token) {
				try {
					await fetch(`${apiUrl}/api/auth/logout`, {
						method: "POST",
						headers: {
							"Authorization": `Bearer ${token}`,
							"Content-Type": "application/json"
						}
					});
				} catch (backendError) {
					console.error("Backend logout failed:", backendError);
				}
			}
	
			try {
				await signOut(auth);
			} catch (firebaseError) {
				console.error("Firebase logout failed:", firebaseError);
			}
	
			navigate("/");
		} catch (error) {
			console.error("Logout error:", error);
			clearTokens();
			setUser(null);
			setRole(null);
			navigate("/");
		}
	}, [apiUrl, navigate, auth]);

	// Switch the active role for the current tab
	const switchActiveRole = useCallback((newRole) => {
		try {
			if (!newRole) {
				sessionStorage.removeItem('activeRole');
				setRole(null);
				return;
			}
			if (roles && roles.includes(newRole)) {
				sessionStorage.setItem('activeRole', newRole);
				setRole(newRole);
			} else {
				console.warn('switchActiveRole: role not in roles list', newRole, roles);
			}
		} catch (e) {
			console.error('switchActiveRole error', e);
		}
	}, [roles]);

	// Log out only active role for this tab (not all roles). This will remove the
	// role from the roles list stored in localStorage and unset the active role in
	// session storage. If this was the user's only role, fall back to full logout.
	const logoutRole = useCallback(async (roleToLogout) => {
		try {
			const currentRole = roleToLogout || role;
			if (!currentRole) return;
			if (!roles || roles.length <= 1) {
				// No multi-role support: perform a full logout
				await logout();
				return;
			}
			// Remove this role from the stored roles
			const updated = (roles || []).filter(r => r !== currentRole);
			setRoles(updated);
			localStorage.setItem('roles', JSON.stringify(updated));
			// legacy key maintained
			localStorage.setItem('role', JSON.stringify(updated));
			// If active role was removed, assign a fallback for this tab
			const currentActive = sessionStorage.getItem('activeRole');
			if (currentActive === currentRole) {
				const fallback = updated.length ? updated[0] : null;
				if (fallback) {
					sessionStorage.setItem('activeRole', fallback);
					setRole(fallback);
				} else {
					sessionStorage.removeItem('activeRole');
					setRole(null);
				}
			}
			// Do NOT clear tokens (full session) — this logs out only role usage in the UI
		} catch (e) {
			console.error('logoutRole error', e);
		}
	}, [roles, role, logout]);

	const checkAuth = useCallback(async (options = { silent: false }) => {
		try {
			setLoading(true);

			const pathname = window.location.pathname;
		
			// DEBUG: log pathname and public routes to help diagnose unexpected redirects
			console.debug('[AuthContext checkAuth] Starting auth check', { 
				pathname, 
				silent: options.silent,
				hasTokens: {
					access: !!localStorage.getItem("accessToken"),
					refresh: !!localStorage.getItem("refreshToken")
				}
			});
		// Skip auth check for public routes
		const publicRoutes = [
			"/",
			"/login",
			"/signup",
			"/register",
			"/about",
			"/FAQs",
			"/contact",
			"/unauthorized",
			"/auth/linkedin/callback",
			"/forgot-password",
			"/reset-password/:oobCode",
			"/jobseeker-profile/:id",
			"/jobseeker-profile/:userId",
			"/employer-profile/:id",
			"/employer-profile/:userId",
			"/profile/:userId",
			"/video-feed/:vid",
			"/jobseeker-video-feed/:vid",
			"/videos/:id",
			"/videos/:pagetype",
			"/videos",
			"/video-player/:id",
			"/video-player",
			"/how-it-works",
			"/pricing",
			"/share",
			"/credits",
			"/blog",
			"/blog/:id",
			"/privacy-policy",
			"/terms-of-service",
			"/cookie-policy",
			"/community-guidelines",
			"/copyright-ip-terms",
			"/eula"
		];            
               
			const isPublicRoute = publicRoutes.some(route => {
			// Handle dynamic routes like '/jobseeker-profile/:id'
			if (route.includes(":")) {
				const basePath = route.split("/:")[0];
				const match = pathname.startsWith(basePath);
				console.debug('[AuthContext] Dynamic route check:', { route, basePath, pathname, match });
				return match;
			}
			const exactMatch = pathname === route;
			if (exactMatch) {
				console.debug('[AuthContext] Exact route match:', { route, pathname });
			}
			return exactMatch;
		});
		
		console.debug('[AuthContext] Public route decision:', { 
			pathname, 
			isPublicRoute,
			silent: options.silent,
			willSkipAuthCheck: isPublicRoute 
		});

		if (isPublicRoute) {
			console.debug('[AuthContext] Skipping auth check - public route');
			setLoading(false);
			return; // Skip auth check for public routes
		}			const accessToken = localStorage.getItem("accessToken");
			const refreshToken = localStorage.getItem("refreshToken");
			const accessExpiresTime = parseInt(localStorage.getItem("accessExpiresTime"), 10);
			const refreshExpiresTime = parseInt(localStorage.getItem("refreshExpiresTime"), 10);

			if (window.location.pathname.includes("/login")) return;

			if (!accessToken && !refreshToken) {
				if (!options.silent) {
					console.warn('[AuthContext] Redirecting to /login - no tokens available', { pathname, stack: new Error().stack });
					navigate("/login");
				}
				throw new Error("No tokens available");
			}

			// Check if refresh token is expired
			if (refreshToken && refreshExpiresTime && Date.now() > refreshExpiresTime) {
				if (!options.silent) {
					console.warn('[AuthContext] Redirecting to /login - refresh token expired', { pathname, stack: new Error().stack });
					navigate("/login");
				}
				throw new Error("Refresh token expired");
			}

			// Check if access token needs refresh
			if (accessToken && accessExpiresTime) {
				if (Date.now() < accessExpiresTime - TOKEN_REFRESH_BUFFER) {
					return;
				}
				
				if (refreshToken) {
					try {
						await refreshTokens();
						return;
					} catch (refreshError) {
						if (!options.silent) {
							console.warn('[AuthContext] Redirecting to /login - refresh failed', { pathname, refreshError, stack: new Error().stack });
							navigate("/login");
						}
						throw refreshError;
					}
				}
			}

			if (!options.silent) navigate("/login");
			throw new Error("Authentication failed");
		} catch (error) {
			if (!options.silent) console.error("Authentication check failed:", error);
			throw error;
		} finally {
			setLoading(false);
		}
	}, [navigate, refreshTokens]);

	const storeAuthData = (userData, isFallback, accessExpiresIn, refreshExpiresIn, accessToken = null) => {
		const safeUser = {
			...(userData || {}),
			role: userData?.role || null
		};

		localStorage.setItem("user", JSON.stringify(safeUser));
		// store role as JSON
		const normalized = normalizeRole(safeUser.role);
		localStorage.setItem("roles", JSON.stringify(normalized));
		localStorage.setItem("role", JSON.stringify(normalized));
		
		if (accessToken) {
			localStorage.setItem("accessExpiresTime", (Date.now() + (accessExpiresIn * 1000)).toString());
			localStorage.setItem("refreshExpiresTime", (Date.now() + (refreshExpiresIn * 1000)).toString());
			localStorage.setItem("accessToken", accessToken);
		}
		
		setUser(safeUser);
		setRoles(normalized);
		// set active role for this tab if not already set
		const existingActive = sessionStorage.getItem('activeRole');
		if (!existingActive) {
			const defaultActive = normalized && normalized.length ? normalized[0] : null;
			if (defaultActive) {
				sessionStorage.setItem('activeRole', defaultActive);
				setRole(defaultActive);
			} else {
				setRole(null);
			}
		} else {
			setRole(existingActive);
		}
		setFallbackMode(isFallback);
	};

	const handleAuthSuccess = useCallback(async (accessToken, refreshToken, provider, roleArg, userArg, accessExpiresIn, refreshExpiresIn, persistentToken = null, firebaseStatus = null) => {
		const userWithRefreshToken = {
			...userArg,
			refresh_token: refreshToken
		};

		localStorage.setItem("accessToken", accessToken);
		localStorage.setItem("user", JSON.stringify(userWithRefreshToken));
		// save roles JSON
		const normalized = normalizeRole(roleArg || userArg?.role);
		localStorage.setItem("roles", JSON.stringify(normalized));
		localStorage.setItem("role", JSON.stringify(normalized));
		localStorage.setItem("accessExpiresTime", (Date.now() + (accessExpiresIn * 1000)).toString());
		localStorage.setItem("refreshExpiresTime", (Date.now() + (refreshExpiresIn * 1000)).toString());

			setUser(userWithRefreshToken);
			setRoles(normalized);
			const prevActive = sessionStorage.getItem('activeRole');
			if (roleArg) {
				const act = Array.isArray(roleArg) ? roleArg[0] : roleArg;
				sessionStorage.setItem('activeRole', act);
				setRole(act);
			} else if (prevActive && normalized && normalized.includes(prevActive)) {
				setRole(prevActive);
			} else {
				const defaultAct = normalized && normalized.length ? normalized[0] : null;
				if (defaultAct) {
					sessionStorage.setItem('activeRole', defaultAct);
					setRole(defaultAct);
				} else {
					setRole(null);
				}
			}
		setFallbackMode(firebaseStatus === "fallback");
		return { success: true, user: userWithRefreshToken, role: normalized, provider };
	}, []);

	// Email/Password Login
	const loginByEmailAndPassword = useCallback(async (email, password) => {
		try {
			const response = await fetch(`${apiUrl}/api/auth/signin`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password })
			});

			const data = await response.json();

			if (!response.ok) {
				return {
					error: true,
					message: data.message || "Login failed",
					status: response.status
				};
			}

			// Store tokens and user data
			storeTokens(data.accessToken, data.refreshToken, data.user, data.accessExpiresIn, data.refreshExpiresIn);

			setUser(data.user);
			const normalized = normalizeRole(data.user?.role || null);
			setRoles(normalized);
			const prevActive = sessionStorage.getItem('activeRole');
			if (!prevActive) {
				const defaultActive = normalized && normalized.length ? normalized[0] : null;
				if (defaultActive) {
					sessionStorage.setItem('activeRole', defaultActive);
					setRole(defaultActive);
				} else {
					setRole(null);
				}
			} else {
				setRole(prevActive);
			}
			
			return { success: true, user: data.user };
			
		} catch (error) {
			console.error("Login error:", error);
			return {
				error: true,
				message: error.message || "Login failed"
			};
		}
	}, [apiUrl]);

	// Google Authentication
	const authenticateWithGoogle = useCallback(async (options = {}) => {
		const normalized = typeof options === "string" ? { role: options } : options;
		const { role = null, useRedirect = false } = normalized;
		const provider = new GoogleAuthProvider();
		provider.setCustomParameters({ prompt: "select_account" });
		try {
			if (auth.currentUser) {
				await signOut(auth);
			}
		} catch (cleanupError) {
			console.warn("Pre-auth signOut failed:", cleanupError);
		}
		const fallbackCodes = [
			"auth/popup-blocked",
			"auth/cancelled-popup-request",
			"auth/web-storage-unsupported",
			"auth/popup-closed-by-user",
			"auth/internal-error"
		];
		try {
			if (useRedirect) {
				localStorage.setItem("oauth_pending", JSON.stringify({ provider: "google", role, timestamp: Date.now() }));
				await signInWithRedirect(auth, provider);
				return { redirect: true };
			}
			const result = await signInWithPopup(auth, provider);
			const idToken = await result.user.getIdToken(true);
			const endpoint = role ? `${apiUrl}/api/auth/signup/google` : `${apiUrl}/api/auth/signin/google`;
			const response = await fetch(endpoint, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ idToken, ...(role ? { role } : {}) })
			});
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Google authentication failed");
			}
			const data = await response.json();
			storeTokens(data.accessToken, data.refreshToken, data.user, data.accessExpiresIn, data.refreshExpiresIn);
			setUser(data.user);
			const normalized = normalizeRole(data.user?.role || null);
			setRoles(normalized);
			// set active role in this tab
			const activeFromPending = role; // the role option passed to authenticateWithGoogle is `role` var above
			if (activeFromPending) {
				const act = Array.isArray(activeFromPending) ? activeFromPending[0] : activeFromPending;
				sessionStorage.setItem('activeRole', act);
				setRole(act);
			} else {
				const prevActive = sessionStorage.getItem('activeRole');
				if (!prevActive && normalized && normalized.length) {
					sessionStorage.setItem('activeRole', normalized[0]);
					setRole(normalized[0]);
				} else {
					setRole(prevActive || (normalized && normalized.length ? normalized[0] : null));
				}
			}
			return { success: true, user: data.user, role: normalizeRole(data.user?.role || null) };
		} catch (error) {
			const isCoopBlocked = error?.message?.includes("Cross-Origin-Opener-Policy");
			if (!useRedirect && (error?.code && fallbackCodes.includes(error.code) || isCoopBlocked)) {
				localStorage.setItem("oauth_pending", JSON.stringify({ provider: "google", role, timestamp: Date.now() }));
				await signInWithRedirect(auth, provider);
				return { redirect: true };
			}
			try {
				await signOut(auth);
			} catch (signOutError) {
				console.warn("Cleanup signOut failed:", signOutError);
			}
			console.error("Google auth error:", error);
			return { error: true, message: error.message || "Google authentication failed" };
		}
	}, [apiUrl, auth]);

	// LinkedIn Authentication
	const authenticateWithLinkedIn = useCallback(async (roleArg = null) => {
		try {
			const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(window.location.origin + "/auth/linkedin/callback")}&scope=${encodeURIComponent("openid profile email")}&state=${Date.now()}`;

			const linkedinAuthWindow = window.open(
				linkedinAuthUrl,
				"_blank",
				"width=600,height=600"
			);

			if (!linkedinAuthWindow) {
				throw new Error("Popup window was blocked. Please allow popups for this site.");
			}

			const result = await new Promise((resolve, reject) => {
				const messageListener = (event) => {
					if (event.origin === window.location.origin) {
						if (event.data.type === "LINKEDIN_AUTH_SUCCESS") {
							window.removeEventListener("message", messageListener);
							resolve(event.data.payload);
						} else if (event.data.type === "LINKEDIN_AUTH_ERROR") {
							window.removeEventListener("message", messageListener);
							reject(new Error(event.data.error || "LinkedIn authentication failed"));
						}
					}
				};

				window.addEventListener("message", messageListener);
			});

			const endpoint = roleArg
				? `${apiUrl}/api/auth/signup/linkedin`
				: `${apiUrl}/api/auth/signin/linkedin`;

			const response = await fetch(endpoint, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					token: result.id_token,
					...(roleArg ? { role: roleArg } : {})
				})
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "LinkedIn authentication failed");
			}

			const data = await response.json();
			
			// Store tokens and user data
			storeTokens(data.accessToken, data.refreshToken, data.user, data.accessExpiresIn, data.refreshExpiresIn);
			setUser(data.user);
			const normalizedRoles = normalizeRole(data.user?.role || null);
			setRoles(normalizedRoles);
			const prevActive = sessionStorage.getItem('activeRole');
			if (!prevActive) {
				const defaultActive = normalizedRoles && normalizedRoles.length ? normalizedRoles[0] : null;
				if (defaultActive) {
					sessionStorage.setItem('activeRole', defaultActive);
					setRole(defaultActive);
				} else {
					setRole(null);
				}
			} else {
				setRole(prevActive);
			}
			return { success: true, user: data.user };
		} catch (error) {
			console.error("LinkedIn auth error:", error);
			return {
				error: true,
				message: error.message || "LinkedIn authentication failed"
			};
		}
	}, [apiUrl, LINKEDIN_CLIENT_ID]);

	// Email Signup
	const signupWithEmail = useCallback(async (email, password, firstName, lastName, roleArg) => {
		try {
			clearTokens(); // Clear any existing tokens before signup
			console.log("Signing up with email:============", email, firstName, lastName, roleArg);
			const response = await fetch(`${apiUrl}/api/auth/signup`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				// backend expects 'role' key; pass roleArg as role
				body: JSON.stringify({ email, password, firstName, lastName, role: roleArg })
			});

			const data = await response.json();
			if (!response.ok) {
				return {
					error: true,
					message: data.message || "Signup failed",
					status: response.status
				};
			}

			// Store all tokens and user data, using data.accessExpiresIn from the backend
			storeTokens(data.accessToken, data.refreshToken, data.user, data.accessExpiresIn, data.refreshExpiresIn);
			setUser(data.user);
			const normalizedSignupRoles = normalizeRole(data.user.role);
			setRoles(normalizedSignupRoles);
			const prevActive = sessionStorage.getItem('activeRole');
			if (!prevActive) {
				const defaultActive = normalizedSignupRoles && normalizedSignupRoles.length ? normalizedSignupRoles[0] : null;
				if (defaultActive) {
					sessionStorage.setItem('activeRole', defaultActive);
					setRole(defaultActive);
				} else {
					setRole(null);
				}
			} else {
				setRole(prevActive);
			}
			
			return { 
				success: true, 
				user: data.user,
				role: normalizeRole(data.user.role)
			};
		} catch (error) {
			console.error("Signup error:", error);
			return {
				error: true,
				message: error.message || "Signup failed"
			};
		}
	}, [apiUrl]);

	useEffect(() => {
		let refreshInterval;

		const checkTokenRefresh = async () => {
			const accessExpiresTime = parseInt(localStorage.getItem("accessExpiresTime"), 10);
			const refreshExpiresTime = parseInt(localStorage.getItem("refreshExpiresTime"), 10);
			const now = Date.now();

			// If refresh token is expired, logout
			if (refreshExpiresTime && now > refreshExpiresTime) {
				await logout();
				return;
			}

			// If access token needs refresh
			if (accessExpiresTime && now > accessExpiresTime - TOKEN_REFRESH_BUFFER) {
				try {
					await refreshTokens();
				} catch (error) {
					console.error("Background refresh failed:", error);
				}
			}
		};

		const processRedirectResultIfAny = async () => {
			try {
				// Handle Firebase redirect result (if user was redirected back after signInWithRedirect)
				const result = await getRedirectResult(auth);
				if (result && result.user) {
					const idToken = await result.user.getIdToken(true);
					// Read pending intent (provider + role) set before redirect
					const pendingRaw = localStorage.getItem('oauth_pending');
					let pending = null;
					try { pending = pendingRaw ? JSON.parse(pendingRaw) : null; } catch (e) { pending = null; }

					// Default to signin if no explicit role/pending info
					const roleFromPending = pending?.role || null;
					const endpoint = roleFromPending
						? `${apiUrl}/api/auth/signup/google`
						: `${apiUrl}/api/auth/signin/google`;

					try {
						const response = await fetch(endpoint, {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({ idToken, ...(roleFromPending ? { role: roleFromPending } : {}) })
						});

						if (response.ok) {
							const data = await response.json();
							storeTokens(
								data.accessToken,
								data.refreshToken,
								data.user,
								data.accessExpiresIn || 3600,
								data.refreshExpiresIn || 86400
							);
							setUser(data.user);
							const normalizedRedirect = normalizeRole(data.user?.role || null);
							setRoles(normalizedRedirect);
							const prevActiveRedirect = sessionStorage.getItem('activeRole');
							if (roleFromPending) {
								const act = Array.isArray(roleFromPending) ? roleFromPending[0] : roleFromPending;
								sessionStorage.setItem('activeRole', act);
								setRole(act);
							} else if (!prevActiveRedirect) {
								const defaultActive = normalizedRedirect && normalizedRedirect.length ? normalizedRedirect[0] : null;
								if (defaultActive) {
									sessionStorage.setItem('activeRole', defaultActive);
									setRole(defaultActive);
								} else {
									setRole(null);
								}
							} else {
								setRole(prevActiveRedirect);
							}
						} else {
							console.warn('Backend did not accept redirect result', await response.text());
						}
					} catch (e) {
						console.error('Error exchanging redirect idToken with backend', e);
					} finally {
						localStorage.removeItem('oauth_pending');
					}
				}
			} catch (err) {
				// getRedirectResult throws when no redirect happened â€” ignore harmless errors
				if (err && err.code !== 'auth/no-auth-event') {
					console.error('Error processing redirect result', err);
				}
			}
		};

		const initializeAuth = async () => {
			try {
				// Process any pending redirect result BEFORE running normal auth checks
				await processRedirectResultIfAny();
				// Run a silent auth check during initialization so missing tokens
				// (expected for anonymous visitors) don't trigger noisy errors or
				// immediate navigations. We still re-run a full check when needed.
				try {
					await checkAuth({ silent: true });
				} catch (err) {
					// These are expected cases on first load when the user is not logged in
					if (err && (err.message === 'No tokens available' || err.message === 'Refresh token expired')) {
						// ignore silently
					} else {
						console.error('Initial auth check failed (unexpected):', err);
					}
				}
				refreshInterval = setInterval(checkTokenRefresh, 30000); // Check every 30 seconds
			} catch (error) {
				console.error("Initial auth flow failed:", error);
			}
		};

		initializeAuth();
		return () => clearInterval(refreshInterval);
	}, [checkAuth, refreshTokens, logout, auth, apiUrl, storeTokens]);

	useEffect(() => {
		// Set loading to false after initial check or if no check is needed
		if (!loading) {
			const storedUser = localStorage.getItem("user");
			if (storedUser) {
				const parsed = JSON.parse(storedUser);
				setUser(parsed);
				const normalized = normalizeRole(parsed.role);
				setRoles(normalized);
				const prevActive = sessionStorage.getItem('activeRole');
				if (!prevActive) {
					const defaultActive = normalized && normalized.length ? normalized[0] : null;
					if (defaultActive) {
						sessionStorage.setItem('activeRole', defaultActive);
						setRole(defaultActive);
					} else {
						setRole(null);
					}
				} else {
					setRole(prevActive);
				}
			}
		}
	}, [loading]);

	const value = useMemo(
		() => ({
			user,
			roles,
			role,
			loading,
			error,
			fallbackMode,
			loginByEmailAndPassword,
			authenticateWithGoogle,
			authenticateWithLinkedIn,
			signupWithEmail,
			registerByEmailAndPassword: signupWithEmail, // Alias for compatibility
			logout,
			checkAuth,
			storeAuthData,
			switchActiveRole,
			refreshTokens,
			logoutRole
		}),
		[
			user,
			role,
			loading,
			error,
			fallbackMode,
			loginByEmailAndPassword,
			authenticateWithGoogle,
			authenticateWithLinkedIn,
			signupWithEmail,
			logout,
			checkAuth,
			storeAuthData,
			refreshTokens
			,switchActiveRole
		]
	);

	// return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>; //contextValue
	// Global postMessage listener: handle popup OAuth callbacks (generic and provider-specific)
	useEffect(() => {
		const messageHandler = async (event) => {
			// Only accept messages from same origin
			if (event.origin !== window.location.origin) return;
			const data = event.data || {};

			try {
				if (data.type === 'OAUTH_COMPLETE') {
					// Generic callback: payload may contain { code, state, access_token, id_token }
					const payload = data.payload || {};
					// If an id_token is present, exchange on backend or treat as final
					if (payload.id_token || payload.access_token) {
						// Let the frontend handle storing via existing handlers if needed
						// For simplicity, forward to storeAuthData if backend already returned user info
						// Otherwise, caller should initiate signin using these tokens.
						console.info('Received OAUTH_COMPLETE payload', payload);
					} else if (payload.code) {
						// If we received an authorization code, send it to backend to exchange
						try {
							const response = await fetch(`${apiUrl}/api/auth/oauth/exchange`, {
								method: 'POST',
								headers: { 'Content-Type': 'application/json' },
								body: JSON.stringify({ code: payload.code })
							});
							if (response.ok) {
								const data = await response.json();
								// Store tokens and user data when available
								if (data.accessToken && data.refreshToken && data.user) {
									storeTokens(data.accessToken, data.refreshToken, data.user, data.accessExpiresIn || 3600, data.refreshExpiresIn || 86400);
									setUser(data.user);
									const normalizedExchange = normalizeRole(data.user?.role || null);
									setRoles(normalizedExchange);
									const prevActiveExchange = sessionStorage.getItem('activeRole');
									if (!prevActiveExchange) {
										const defaultActive = normalizedExchange && normalizedExchange.length ? normalizedExchange[0] : null;
										if (defaultActive) {
											sessionStorage.setItem('activeRole', defaultActive);
											setRole(defaultActive);
										} else {
											setRole(null);
										}
									} else {
										setRole(prevActiveExchange);
									}
								}
							}
						} catch (e) {
							console.error('Backend exchange failed', e);
						}
					}
				} else if (data.type === 'LINKEDIN_AUTH_SUCCESS') {
					// LinkedIn handler used elsewhere â€” no-op here since Linkedincallback posts directly
					console.info('LinkedIn success from popup', data.payload);
				} else if (data.type === 'LINKEDIN_AUTH_ERROR') {
					console.warn('LinkedIn auth error from popup', data);
				} else if (data.type === 'google-oauth-complete') {
					// Google OAuth complete with token or code
					console.info('Google OAuth complete', data.payload);
				}
			} catch (err) {
				console.error('Error handling auth popup message', err);
			}
		};

		window.addEventListener('message', messageHandler);
		return () => window.removeEventListener('message', messageHandler);
	}, [apiUrl, storeTokens]);

	return (
		<AuthContext.Provider value={value}>
			 {children}
		{/* Temporary debug panel - remove for production */}
		{/* <div style={{
	position: 'fixed',
	bottom: 0,
	right: 0,
	backgroundColor: 'white',
	padding: '10px',
	border: '1px solid #ccc',
	zIndex: 1000
}}>
	<h4>Auth Debug</h4>
	<div>Access Token: {localStorage.getItem('accessToken') ? 'âœ…' : 'â‌Œ'}</div>
	<div>Refresh Token: {localStorage.getItem('refreshToken') ? 'âœ…' : 'â‌Œ'}</div>
	<div>Token Expiry: {localStorage.getItem('accessExpiresTime') ? 
		new Date(parseInt(localStorage.getItem('accessExpiresTime'))).toLocaleString() : 'None'}</div>
	<div>Time Now: {new Date().toLocaleString()}</div>
	<div>Seconds Until Expiry: {localStorage.getItem('accessExpiresTime') ? 
		Math.round((parseInt(localStorage.getItem('accessExpiresTime')) - Date.now()) / 1000) : 'N/A'}</div>
	<button onClick={checkAuth}>Force Check Auth</button>
	<button onClick={refreshTokens}>Force Refresh</button>
	<button onClick={logout}>Force Logout</button>
</div> */}
</AuthContext.Provider>
);
};

export const useAuth = () => {
const context = useContext(AuthContext);
if (!context) {
  throw new Error('useAuth must be used within an AuthProvider');
}
return context;
};