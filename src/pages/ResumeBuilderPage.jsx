import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  extractCVData,
  generateResume,
  previewResume,
  saveResume,
  updateResume,
  getUserResumes,
  getUserProfile,
  getUserExperiences,
  getUserEducation,
  getUserSkills,
  getSkills,
  createSkill,
  getCategories,
  getSkillTypes,
  addUserSkill,
  updateUserProfile,
  updateUserEducation,
  updateUserExperience,
  addUserEducation,
  addUserExperience
} from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/UI/card.jsx';
import { Button } from '@/components/UI/button.jsx';
import { Input } from '@/components/UI/input.jsx';
import { Label } from '@/components/UI/label.jsx';
import { Textarea } from '@/components/UI/textarea.jsx';
import { Badge } from '@/components/UI/badge.jsx';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/UI/tabs.jsx';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/UI/accordion.jsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/UI/dialog.jsx';
import { Progress } from '@/components/UI/progress.jsx';
import {
  Upload,
  Download,
  Eye,
  Plus,
  Trash2,
  Edit,
  Save,
  FileText,
  Briefcase,
  GraduationCap,
  Award,
  Languages,
  Trophy,
  Loader2,
  File,
  ChevronDown
  ,Zap, Layers, Heart
} from 'lucide-react';
import themeColors from '@/config/theme-colors-jobseeker';

export default function ResumeBuilderPage() {
  // const { user } = useAuth(); // Removed: unused variable
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('build');
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Resume data
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      first_name: '',
      second_name: '',
      last_name: '',
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: ''
    },
    summary: '',
    experiences: [],
    education: [],
    skills: [],
    languages: [],
    certifications: [],
    projects: []
  });

  const [savedResumes, setSavedResumes] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [openExp, setOpenExp] = useState(null);
  const [openEdu, setOpenEdu] = useState(null);

  const [availableSkills, setAvailableSkills] = useState([]);
  const [fetchingSkills, setFetchingSkills] = useState(false);
  const [skillsFetchError, setSkillsFetchError] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [skillCategoryFilter, setSkillCategoryFilter] = useState('');
  const [skillTypeFilter, setSkillTypeFilter] = useState('');
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);
  const typeDropdownRef = useRef(null);
  const [categoriesMap, setCategoriesMap] = useState({});
  const [allSkillTypes, setAllSkillTypes] = useState([]);

  // Template selection state
  const [selectedTemplate, setSelectedTemplate] = useState('modern');

  // Edit mode state
  const [editingResumeId, setEditingResumeId] = useState(null);
  const [editingResumeTitle, setEditingResumeTitle] = useState('');
  const [isEditingSnapshot, setIsEditingSnapshot] = useState(false);

  // CV Extraction dialog state
  const [extractionDialogOpen, setExtractionDialogOpen] = useState(false);
  const [extractedData, setExtractedData] = useState(null);

  // localize helper: safely extract localized string from string/object
  // Default 'preferred' is undefined so we prefer the page/browser language when available
  const localize = (val, preferred = undefined) => {
    if (val == null) return '';
    if (typeof val === 'string') return val;
    if (typeof val === 'number') return String(val);
    if (typeof val === 'object') {
      try {
        if (preferred && val[preferred]) return val[preferred];
        if (typeof navigator !== 'undefined') {
          const lang = (navigator.language || navigator.userLanguage || '').split('-')[0];
          if (lang && val[lang]) return val[lang];
        }
        for (const k of Object.keys(val)) {
          if (typeof val[k] === 'string') return val[k];
        }
        return JSON.stringify(val);
      } catch (e) {
        return String(val);
      }
    }
    return String(val);
  };

  // Type label translations (provide English and some common translations as a helpful default).
  const TYPE_LABELS = {
    hard: { en: 'Hard', ar: 'صعب', fr: 'Dur' },
    hybrid: { en: 'Hybrid', ar: 'هجين', fr: 'Hybride' },
    soft: { en: 'Soft', ar: 'ناعِم', fr: 'Souple' }
  };

  const getTypeLabel = (type) => {
    if (!type) return '';
    const key = String(type).toLowerCase();
    if (TYPE_LABELS[key]) return localize(TYPE_LABELS[key]);
    // fallback: try to localize raw string or return as-is
    return localize(type) || String(type);
  };

  const getTypeIcon = (type) => {
    const key = String(type || '').toLowerCase();
    if (key === 'hard') return Zap;
    if (key === 'hybrid') return Layers;
    if (key === 'soft') return Heart;
    return Award;
  };

  // Helper: extract a display name for a skill object (handles multiple shapes & translations)
  const extractSkillName = (s) => {
    if (!s) return '';
    if (typeof s === 'string') return s;
    // common direct properties
    if (typeof s.name === 'string' && s.name.trim()) return s.name;
    // localized name object
    if (s.name && typeof s.name === 'object') {
      const lang = (typeof navigator !== 'undefined' && navigator.language) ? navigator.language.split('-')[0] : 'en';
      if (s.name[lang]) return s.name[lang];
      if (s.name.en) return s.name.en;
      const first = Object.values(s.name).find(v => typeof v === 'string' && v.trim());
      if (first) return first;
    }
    // nested skill object
    if (s.skill && typeof s.skill.name === 'string') return s.skill.name;
    if (s.skill && typeof s.skill.name === 'object') {
      const lang = (typeof navigator !== 'undefined' && navigator.language) ? navigator.language.split('-')[0] : 'en';
      if (s.skill.name[lang]) return s.skill.name[lang];
      if (s.skill.name.en) return s.skill.name.en;
      const first = Object.values(s.skill.name).find(v => typeof v === 'string' && v.trim());
      if (first) return first;
    }
    if (typeof s.skill_name === 'string' && s.skill_name.trim()) return s.skill_name;
    if (typeof s.title === 'string' && s.title.trim()) return s.title;
    if (typeof s.label === 'string' && s.label.trim()) return s.label;
    if (Array.isArray(s.translations)) {
      const lang = (typeof navigator !== 'undefined' && navigator.language) ? navigator.language.split('-')[0] : 'en';
      const t = s.translations.find(t => t.lang === lang) || s.translations.find(t => t.lang === 'en') || s.translations[0];
      if (t && (t.value || t.text)) return t.value || t.text;
    }
    // fallback: first string-valued property
    for (const k of Object.keys(s)) {
      if (typeof s[k] === 'string' && s[k].trim()) return s[k];
    }
    return JSON.stringify(s);
  };

  // Fetch available canonical skills list
  const fetchAvailableSkills = async () => {
    setFetchingSkills(true);
    setSkillsFetchError('');
    try {
      const res = await getSkills();

      // Support multiple possible response shapes returned by different backends
      let arr = [];
      if (!res) arr = [];
      else if (Array.isArray(res)) arr = res;
      else if (Array.isArray(res.data)) arr = res.data;
      else if (Array.isArray(res.data?.data)) arr = res.data.data;
      else if (Array.isArray(res.data?.skills)) arr = res.data.skills;
      else if (Array.isArray(res.data?.rows)) arr = res.data.rows;
      else if (Array.isArray(res.data?.result)) arr = res.data.result;
      else if (Array.isArray(res.data?.data?.rows)) arr = res.data.data.rows;
      else {
        // try to pick first array-like property
        const maybe = res.data || {};
        for (const k of Object.keys(maybe)) {
          if (Array.isArray(maybe[k])) {
            arr = maybe[k];
            break;
          }
        }
      }

      setAvailableSkills(arr || []);
      // Also try to fetch categories so we can use category.skill_type
      try {
        const catsRes = await getCategories();
        const catsArr = Array.isArray(catsRes?.data) ? catsRes.data : (Array.isArray(catsRes?.data?.data) ? catsRes.data.data : (Array.isArray(catsRes) ? catsRes : []));
        const map = (catsArr || []).reduce((m, c) => {
          const id = c?.id || c?._id || c?.code || null;
          if (id) m[id] = c;
          return m;
        }, {});
        setCategoriesMap(map);
        // derive all distinct skill_type values from categories and expose them
        try {
          // Prefer authoritative list from backend when available
          try {
            const typesRes = await getSkillTypes();
            // Try many possible shapes
            const tData = typesRes?.data ?? typesRes;
            let tArr = [];
            if (Array.isArray(tData)) tArr = tData;
            else if (Array.isArray(tData?.types)) tArr = tData.types;
            else if (Array.isArray(tData?.data)) tArr = tData.data;
            else if (Array.isArray(tData?.rows)) tArr = tData.rows;
            else if (Array.isArray(tData?.result)) tArr = tData.result;

            if (Array.isArray(tArr) && tArr.length) {
              // normalize and dedupe
              const mapTypes = new Map();
              for (const tt of tArr) {
                try { mapTypes.set(String(tt).toLowerCase(), String(tt)); } catch (e) {}
              }
              const resolved = Array.from(mapTypes.values()).sort((a,b) => String(a).localeCompare(String(b)));
              console.debug('[ResumeBuilder] getSkillTypes returned:', resolved);
              setAllSkillTypes(resolved);
            } else {
              // fallback to deriving from categories/skills
              const typesSet = new Set();
              for (const k of Object.keys(map)) {
                const cat = map[k];
                const t = cat?.skill_type || cat?.type;
                if (t) typesSet.add(String(t));
              }
              try {
                const skillsArr = arr || [];
                for (const s of skillsArr) {
                  const cand = s?.category ?? s?.ctg ?? (s?.skill && s.skill.category) ?? (Array.isArray(s?.categories) ? s.categories[0] : null);
                  let tp = '';
                  if (!cand) tp = extractSkillType(s);
                  else if (typeof cand === 'string') {
                    const catObj = map[cand];
                    if (catObj && (catObj.skill_type || catObj.type)) tp = String(catObj.skill_type || catObj.type);
                    else tp = String(cand);
                  } else if (typeof cand === 'object') {
                    tp = String(cand.skill_type || cand.type || extractSkillType(s) || '');
                  }
                  if (tp) typesSet.add(String(tp));
                }
              } catch (e) {
                console.warn('Failed to derive types from availableSkills', e);
              }
              // set derived types (no intermediate arrTypes variable)
              setAllSkillTypes(Array.from(typesSet).sort((a,b) => String(a).localeCompare(String(b))));
              console.debug('[ResumeBuilder] derived types from categories/skills:', Array.from(typesSet));
            }
          } catch (e) {
            console.warn('getSkillTypes failed inside fetchAvailableSkills, deriving types instead', e);
            const typesSet = new Set();
            for (const k of Object.keys(map)) {
              const cat = map[k];
              const t = cat?.skill_type || cat?.type;
              if (t) typesSet.add(String(t));
            }
            setAllSkillTypes(Array.from(typesSet).sort((a,b) => String(a).localeCompare(String(b))));
          }
        } catch (e) {
          console.warn('Failed to derive types from categoriesMap', e);
          setAllSkillTypes([]);
        }
      } catch (e) {
        // non-fatal: categories may not be available
        console.warn('Failed to fetch categories for skills:', e);
        setCategoriesMap({});
        setAllSkillTypes([]);
      }
      console.debug('[ResumeBuilder] fetched availableSkills count=', (arr || []).length, 'sample=', (arr || [])[0]);
      if (!arr || arr.length === 0) setSkillsFetchError('No skills returned from server');
    } catch (err) {
      console.warn('Failed to fetch available skills', err);
      setAvailableSkills([]);
      setSkillsFetchError(err?.message || String(err));
    } finally {
      setFetchingSkills(false);
    }
  };

  // Fetch saved resumes for the Saved tab
  const fetchSavedResumes = async () => {
    try {
      const res = await getUserResumes();
      const arr = Array.isArray(res?.data) ? res.data : (res?.data?.resumes || []);
      setSavedResumes(arr || []);
    } catch (err) {
      console.warn('Failed to fetch saved resumes', err);
      setSavedResumes([]);
    }
  };

  // On mount: populate from profile and fetch reference lists
  useEffect(() => {
    populateFromProfile();
    fetchAvailableSkills();
    fetchSavedResumes();
    // Also ensure we fetch distinct skill types from backend via getSkillTypes
    loadSkillTypes();
  }, []);

  // Load distinct skill_type values from backend using the dedicated endpoint
  const loadSkillTypes = async () => {
    try {
      const res = await getSkillTypes();

      // Normalize various response shapes returned by different backends.
      const data = res?.data ?? res;
      let arr = [];

      if (Array.isArray(data)) arr = data;
      else if (Array.isArray(data?.types)) arr = data.types;
      else if (Array.isArray(data?.data)) arr = data.data;
      else if (Array.isArray(data?.rows)) arr = data.rows;
      else if (Array.isArray(data?.result)) arr = data.result;

      // normalize and dedupe (preserve first-seen casing)
      const map = new Map();
      for (const t of (arr || [])) {
        try {
          const key = String(t).toLowerCase();
          if (!map.has(key)) map.set(key, String(t));
        } catch (e) {
          // skip malformed
        }
      }
      let normalized = Array.from(map.values()).sort((a,b) => String(a).localeCompare(String(b)));

      // fallback: try categories endpoint for types
      if (!normalized.length) {
        try {
          const catsRes = await getCategories();
          const catsArr = Array.isArray(catsRes?.data) ? catsRes.data : (Array.isArray(catsRes) ? catsRes : []);
          const typesSet = new Set();
          for (const c of (catsArr || [])) {
            const t = c?.skill_type || c?.type;
            if (t) typesSet.add(String(t));
          }
          normalized = Array.from(typesSet).sort((a,b) => String(a).localeCompare(String(b)));
        } catch (e) {
          console.debug('categories fallback for types failed', e);
        }
      }

      // final fallback to sensible defaults so UI always shows the three known types
      const defaultTypes = ['hard', 'hybrid', 'soft'];
      if (!normalized.length) normalized = defaultTypes;

      setAllSkillTypes(normalized);
    } catch (err) {
      console.warn('Failed to load skill types via getSkillTypes:', err);
      // Ensure UI still shows sane defaults
      setAllSkillTypes(['hard', 'hybrid', 'soft']);
    }
  };

  // Derived lists for category/type filters and a set of already-added skill names
  const availableSkillCategories = useMemo(() => {
    if (!Array.isArray(availableSkills)) return [];
    const names = new Set();
    for (const s of availableSkills) {
      const cand = s?.category ?? s?.ctg ?? (s?.skill && s.skill.category) ?? (Array.isArray(s?.categories) ? s.categories[0] : null);
      if (!cand) continue;
      if (typeof cand === 'string') {
        // treat as id -> try lookup in categoriesMap
        const catObj = categoriesMap[cand];
        if (catObj) names.add(localize(catObj.name));
        else names.add(cand);
      } else if (typeof cand === 'object') {
        const name = localize(cand.name ?? cand.title ?? cand.label) || extractSkillCategory(s);
        if (name) names.add(name);
      }
    }
    return Array.from(names);
  }, [availableSkills, categoriesMap]);

  const availableSkillTypes = useMemo(() => {
    const types = new Set();

    // First, collect all distinct skill_type values from the full categories map
    if (categoriesMap && typeof categoriesMap === 'object') {
      for (const id of Object.keys(categoriesMap)) {
        const c = categoriesMap[id];
        const t = c?.skill_type || c?.type;
        if (t) types.add(String(t));
      }
    }

    // Also include any types discoverable from the availableSkills list as a fallback
    if (Array.isArray(availableSkills)) {
      for (const s of availableSkills) {
        const cand = s?.category ?? s?.ctg ?? (s?.skill && s.skill.category) ?? (Array.isArray(s?.categories) ? s.categories[0] : null);
        let tp = '';
        if (!cand) {
          tp = extractSkillType(s);
        } else if (typeof cand === 'string') {
          const catObj = categoriesMap[cand];
          if (catObj && (catObj.skill_type || catObj.type)) tp = String(catObj.skill_type || catObj.type);
          else tp = String(cand);
        } else if (typeof cand === 'object') {
          tp = String(cand.skill_type || cand.type || extractSkillType(s) || '');
        }
        if (tp) types.add(tp);
      }
    }

    return Array.from(types);
  }, [categoriesMap, availableSkills]);

  const addedSkillNames = useMemo(() => new Set((resumeData.skills || []).map(s => String(extractSkillName(s) || '').toLowerCase())), [resumeData.skills]);

  // Helper: compute how many available skills match a given type (and current category filter)
  const getTypeCount = (type) => {
    if (!type || !Array.isArray(availableSkills)) return 0;
    try {
      return availableSkills.filter(s => {
        // determine type for this skill using categoriesMap when category is an id
        const cand = s?.category ?? s?.ctg ?? (s?.skill && s.skill.category) ?? (Array.isArray(s?.categories) ? s.categories[0] : null);
        let tp = '';
        if (!cand) {
          tp = extractSkillType(s) || '';
        } else if (typeof cand === 'string') {
          const catObj = categoriesMap[cand];
          if (catObj && (catObj.skill_type || catObj.type)) tp = String(catObj.skill_type || catObj.type);
          else tp = String(cand);
        } else if (typeof cand === 'object') {
          tp = String(cand.skill_type || cand.type || extractSkillType(s) || '');
        }
  if (!tp) return false;
  if (String(tp).toLowerCase() !== String(type).toLowerCase()) return false;

        // if a category filter is active, ensure this skill also matches that category
        if (skillCategoryFilter) {
          let catName = '';
          if (cand) {
            if (typeof cand === 'string') {
              const catObj = categoriesMap[cand];
              catName = catObj ? localize(catObj.name) : cand;
            } else if (typeof cand === 'object') {
              catName = localize(cand.name ?? cand.title ?? cand.label) || extractSkillCategory(s);
            }
          }
          if (String(catName).toLowerCase() !== String(skillCategoryFilter).toLowerCase()) return false;
        }

        return true;
      }).length;
    } catch (e) {
      return 0;
    }
  };

  // If a type is selected but currently has 0 matching skills (given filters), clear the selection and any skill input
  useEffect(() => {
    if (skillTypeFilter) {
      const cnt = getTypeCount(skillTypeFilter);
      if (cnt === 0) {
        // keep the selected type but clear the skill input so the skills dropdown becomes empty
        // this will leave the type visible/selected but the skill list will have no entries
        setSkillInput('');
      }
    }
  }, [skillTypeFilter, skillCategoryFilter, availableSkills, categoriesMap]);

  // Close the type dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (typeDropdownRef?.current && !typeDropdownRef.current.contains(e.target)) {
        setTypeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleFileUpload = async (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setExtracting(true);
    setProgress(0);

    const form = new FormData();
    form.append('file', file);

    try {
      const res = await extractCVData(form);
      const data = res?.data || res;

      console.log('[ResumeBuilder] CV extraction result:', data);

      // Store extracted data and show dialog
      setExtractedData(data);
      setExtractionDialogOpen(true);
      
      toast({ title: 'Extraction complete', description: 'Review the extracted data and choose an action', variant: 'default' });
    } catch (err) {
      console.error('Error extracting CV:', err);
      toast({ title: 'Error', description: 'Failed to extract CV data', variant: 'destructive' });
    } finally {
      setExtracting(false);
      setProgress(0);
    }
  };

  // Handle "Populate to Profile" action from extraction dialog
  const handlePopulateToProfile = async () => {
    if (!extractedData) return;
    
    setLoading(true);
    try {
      // Map extracted data to resumeData format
      const mappedData = {
        personalInfo: extractedData.personalInfo || extractedData.personal || {},
        summary: extractedData.summary || '',
        experiences: extractedData.experiences || [],
        education: extractedData.education || [],
        skills: extractedData.skills || [],
        languages: extractedData.languages || [],
        certifications: extractedData.certifications || [],
        projects: extractedData.projects || []
      };
      
      // Set in form
      setResumeData(mappedData);
      
      // Sync to profile immediately - need to wait for state update
      // Use the mapped data directly instead of relying on state
      await syncProfileFromData(mappedData);
      
      setExtractionDialogOpen(false);
      setActiveTab('build');
      
      toast({
        title: "Success",
        description: "CV data populated to your profile!",
      });
    } catch (error) {
      console.error('Error populating to profile:', error);
      toast({
        title: "Error",
        description: "Failed to populate profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle "Save as New Resume" action from extraction dialog
  const handleSaveAsNewResume = async () => {
    if (!extractedData) return;
    
    setLoading(true);
    try {
      // Map extracted data to backend schema
      const mappedData = {
        personalInfo: extractedData.personalInfo || extractedData.personal || {},
        summary: extractedData.summary || '',
        experience: extractedData.experiences || extractedData.experience || [],
        education: extractedData.education || [],
        skills: extractedData.skills || [],
        languages: extractedData.languages || [],
        certifications: extractedData.certifications || [],
        projects: extractedData.projects || []
      };
      
      const payload = { 
        data: mappedData, 
        template: 'modern',
        title: 'Extracted CV - ' + new Date().toLocaleDateString()
      };
      
      await saveResume(payload);
      
      setExtractionDialogOpen(false);
      fetchSavedResumes();
      setActiveTab('saved');
      
      toast({
        title: "Success",
        description: "Resume saved successfully!",
      });
    } catch (error) {
      console.error('Error saving resume:', error);
      toast({
        title: "Error",
        description: "Failed to save resume",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  function extractSkillCategory(s) {
    if (!s) return '';
    // category may be a string or object
    const cand = s.category || s.ctg || s.type || (s.skill && s.skill.category) || (s.categories && Array.isArray(s.categories) && s.categories[0]);
    if (!cand) return '';
    if (typeof cand === 'string') return cand;
    if (typeof cand === 'object') {
      if (typeof cand.name === 'string') return cand.name;
      if (typeof cand.title === 'string') return cand.title;
      if (cand.name && typeof cand.name === 'object') {
        const lang = (typeof navigator !== 'undefined' && navigator.language) ? navigator.language.split('-')[0] : 'en';
        if (cand.name[lang]) return cand.name[lang];
        if (cand.name.en) return cand.name.en;
        const first = Object.values(cand.name).find(v => typeof v === 'string' && v.trim());
        if (first) return first;
      }
      // fallback
      for (const k of Object.keys(cand)) {
        if (typeof cand[k] === 'string' && cand[k].trim()) return cand[k];
      }
    }
    return '';
  }

  function extractSkillType(s) {
    if (!s) return '';
    const cand = s.skill_type || s.type || (s.category && s.category.skill_type) || (s.skill && s.skill.category && s.skill.category.skill_type) || (s.ctg && s.ctg.skill_type);
    if (!cand) return '';
    if (typeof cand === 'string') return cand;
    if (typeof cand === 'object') {
      if (typeof cand.skill_type === 'string') return cand.skill_type;
      if (typeof cand.type === 'string') return cand.type;
      // fallback to name/title similar to category
      if (typeof cand.name === 'string') return cand.name;
      if (cand.name && typeof cand.name === 'object') {
        const lang = (typeof navigator !== 'undefined' && navigator.language) ? navigator.language.split('-')[0] : 'en';
        if (cand.name[lang]) return cand.name[lang];
        if (cand.name.en) return cand.name.en;
        const first = Object.values(cand.name).find(v => typeof v === 'string' && v.trim());
        if (first) return first;
      }
      for (const k of Object.keys(cand)) {
        if (typeof cand[k] === 'string' && cand[k].trim()) return cand[k];
      }
    }
    return '';
  }

  const handleAddSkill = async (skill) => {
    if (!skill) return;

    const normalizedInput = (String(skill || '')).trim();
    const alreadyNames = new Set((resumeData.skills || []).map(s => extractSkillName(s).toLowerCase()));

    // try to find canonical skill object in availableSkills by name
    let match = Array.isArray(availableSkills) ? availableSkills.find(s => extractSkillName(s).toLowerCase() === normalizedInput.toLowerCase()) : null;

    try {
      // if no match, try server-side search
      if (!match) {
        const searchRes = await getSkills(normalizedInput);
        const cand = (searchRes?.data && Array.isArray(searchRes.data)) ? searchRes.data[0] : (searchRes?.data?.data && Array.isArray(searchRes.data.data) ? searchRes.data.data[0] : null);
        if (cand) match = cand;
      }

      let toAdd = match ? match : normalizedInput;

      // prevent duplicates
      if (alreadyNames.has(extractSkillName(toAdd).toLowerCase())) {
        console.debug('[ResumeBuilder] handleAddSkill: already added', { skill, toAdd });
        return;
      }

      // If we have a canonical skill object with id, add it to the user's profile first
      if (match && (match.id || match._id || match.skill_id)) {
        const skillId = match.id || match._id || match.skill_id;
        try {
          await addUserSkill({ skill_id: skillId, level: 'Intermediate', years_experience: 1 });
        } catch (err) {
          console.error('Failed to add user skill (existing):', err);
          // continue and still add to UI
        }
        // add canonical object to UI
        setResumeData(prev => ({ ...prev, skills: [...(prev.skills || []), match] }));
        return;
      }

      // If not matched, attempt to create the skill on the server then attach
      if (!match) {
        try {
          const createRes = await createSkill({ name: { en: normalizedInput } });
          const created = createRes?.data || createRes;
          const createdId = created?.id || created?._id || created?.skill_id;
          if (createdId) {
            // add to user's skills
            try {
              await addUserSkill({ skill_id: createdId, level: 'Intermediate', years_experience: 1 });
            } catch (err) {
              console.error('Failed to add user skill (created):', err);
            }
            // add created object to UI list
            setResumeData(prev => ({ ...prev, skills: [...(prev.skills || []), created] }));
            // refresh availableSkills list to include created skill
            try {
              const refreshed = await getSkills();
              const arr = Array.isArray(refreshed?.data) ? refreshed.data : (Array.isArray(refreshed?.data?.data) ? refreshed.data.data : []);
              setAvailableSkills(arr);
            } catch (err) {
              console.warn('Failed to refresh skills after create', err);
            }
            return;
          }
        } catch (err) {
          console.error('createSkill failed:', err);
        }
      }

      // Fallback: add raw string to UI only
      setResumeData(prev => ({ ...prev, skills: [...(prev.skills || []), normalizedInput] }));
    } catch (err) {
      console.error('[ResumeBuilder] handleAddSkill error', err);
      // fallback to optimistic add
      setResumeData(prev => ({ ...prev, skills: [...(prev.skills || []), skill] }));
    }
  };
  

  const handleAddExperience = () => {
    setResumeData(prev => {
      const idx = prev.experiences.length;
      const newExp = {
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      };
      const next = { ...prev, experiences: [...prev.experiences, newExp] };
      // schedule UI open/scroll after React updates
      setTimeout(() => {
        const id = `exp-${idx}`;
        setOpenExp(id);
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
      return next;
    });
  };

  const handleRemoveExperience = (index) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index)
    }));
  };

  const handleExperienceChange = (index, field, value) => {
    setResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const handleAddEducation = () => {
    setResumeData(prev => {
      const idx = prev.education.length;
      const newEdu = {
        degree: '',
        institution: '',
        location: '',
        startYear: '',
        endYear: '',
        gpa: '',
        description: ''
      };
      const next = { ...prev, education: [...prev.education, newEdu] };
      setTimeout(() => {
        const id = `edu-${idx}`;
        setOpenEdu(id);
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
      return next;
    });
  };

  const handleRemoveEducation = (index) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const handleEducationChange = (index, field, value) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  

  const handleRemoveSkill = (skill) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  // Sync resume form data back to profile entities (education, experience, personal info)
  const syncProfileFromResumeData = async () => {
    await syncProfileFromData(resumeData);
  };

  // Helper function that syncs data to profile (can accept data parameter)
  const syncProfileFromData = async (data) => {
    try {
      // Update personal info in job seeker profile
      await updateUserProfile({
        first_name: data.personalInfo.first_name,
        second_name: data.personalInfo.second_name,
        last_name: data.personalInfo.last_name,
        phone: data.personalInfo.phone,
        location: data.personalInfo.location,
        linkedin: data.personalInfo.linkedin,
        website: data.personalInfo.website,
        summary: data.summary
      });

      // Sync experiences - for simplicity, we'll update existing ones by position
      const existingExperiences = await getUserExperiences();
      const existingExpArray = existingExperiences?.data?.experiences || existingExperiences?.data || [];
      
      for (let i = 0; i < data.experiences.length; i++) {
        const exp = data.experiences[i];
        const payload = {
          title: exp.title,
          company: exp.company,
          location: exp.location,
          start_date: exp.startDate,
          end_date: exp.current ? null : exp.endDate,
          current: exp.current,
          description: exp.description
        };
        
        if (existingExpArray[i]?.id) {
          // Update existing
          await updateUserExperience(existingExpArray[i].id, payload);
        } else {
          // Create new
          await addUserExperience(payload);
        }
      }

      // Sync education
      const existingEducation = await getUserEducation();
      const existingEduArray = existingEducation?.data?.educations || existingEducation?.data || [];
      
      for (let i = 0; i < data.education.length; i++) {
        const edu = data.education[i];
        const payload = {
          degree: edu.degree,
          institution: edu.institution,
          location: edu.location || '',
          startDate: edu.startYear ? `${edu.startYear}-01-01` : null,
          endDate: edu.endYear ? `${edu.endYear}-12-31` : null,
          description: edu.description || ''
        };
        
        if (existingEduArray[i]?.id) {
          // Update existing
          await updateUserEducation(existingEduArray[i].id, payload);
        } else {
          // Create new
          await addUserEducation(payload);
        }
      }

      console.log('Profile synced successfully');
    } catch (err) {
      console.error('Error syncing profile:', err);
      throw err;
    }
  };

  // Handle "Update Profile" button click in edit mode
  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      await syncProfileFromResumeData();
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
      // Exit edit mode
      setIsEditingSnapshot(false);
      setEditingResumeId(null);
      setEditingResumeTitle('');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle edit button click for saved resumes
  const handleEditResume = (resume) => {
    try {
      // Load saved resume content into form
      // Backend stores resume.content as a JSON string - parse when necessary
      const raw = resume.content;
      let content = {};
      try {
        content = typeof raw === 'string' && raw ? JSON.parse(raw) : (raw || {});
      } catch (e) {
        console.warn('Failed to parse resume.content, falling back to raw value', e);
        content = raw || {};
      }
      
      console.log('[ResumeBuilder] Loading resume for edit:', { resume, content });
      
      setResumeData({
        personalInfo: {
          first_name: content.personalInfo?.first_name || '',
          second_name: content.personalInfo?.second_name || '',
          last_name: content.personalInfo?.last_name || '',
          fullName: content.personalInfo?.fullName || '',
          email: content.personalInfo?.email || '',
          phone: content.personalInfo?.phone || '',
          location: content.personalInfo?.location || content.personalInfo?.address || '',
          linkedin: content.personalInfo?.linkedin || '',
          website: content.personalInfo?.website || ''
        },
        summary: content.personalInfo?.summary || content.summary || '',
        experiences: (content.experience || content.experiences || []).map(exp => ({
          title: exp.title || '',
          company: exp.company || '',
          location: exp.location || '',
          startDate: exp.startDate || '',
          endDate: exp.endDate || '',
          current: exp.current || false,
          description: exp.description || ''
        })),
        education: (content.education || []).map(edu => ({
          degree: edu.degree || '',
          institution: edu.institution || '',
          location: edu.location || '',
          startYear: edu.startYear || (edu.graduationDate ? edu.graduationDate.slice(0, 4) : ''),
          endYear: edu.graduationDate || edu.endYear || '',
          gpa: edu.gpa || '',
          description: edu.description || ''
        })),
        skills: content.skills || [],
        languages: content.languages || [],
        certifications: content.certifications || [],
        projects: content.projects || []
      });

      // Set edit mode state
      setEditingResumeId(resume.id);
      setEditingResumeTitle(resume.title || 'Untitled Resume');
      setIsEditingSnapshot(true);
      setSelectedTemplate(resume.template || 'modern');

      // Switch to build tab
      setActiveTab('build');

      toast({
        title: "Editing Resume",
        description: `Now editing: ${resume.title || 'Untitled Resume'}`,
      });
    } catch (error) {
      console.error('Error loading resume for edit:', error);
      toast({
        title: "Error",
        description: "Failed to load resume",
        variant: "destructive",
      });
    }
  };

  // Handle preview button click for saved resumes
  const handlePreviewSaved = async (resume) => {
    try {
      // Parse saved content if it's a JSON string
      const raw = resume.content;
      let content = {};
      try {
        content = typeof raw === 'string' && raw ? JSON.parse(raw) : (raw || {});
      } catch (e) {
        console.warn('Failed to parse resume.content for preview, using raw value', e);
        content = raw || {};
      }
      const template = resume.template || 'modern';
      
      console.log('[ResumeBuilder] Preview saved resume:', { content, template });
      
      // Generate preview HTML from saved content
      const payload = { data: content, template };
      const response = await previewResume(payload);

      const html = response?.data?.data?.html;
      if (html) {
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      } else {
        throw new Error('No preview HTML returned');
      }
    } catch (error) {
      console.error('Error previewing saved resume:', error);
      toast({
        title: "Error",
        description: "Failed to preview resume",
        variant: "destructive",
      });
    }
  };

  // Handle download PDF for saved resumes
  const handleDownloadSaved = async (resume) => {
    try {
      // Parse saved content which may be stored as string in DB
      const raw = resume.content;
      let content = {};
      try {
        content = typeof raw === 'string' && raw ? JSON.parse(raw) : (raw || {});
      } catch (e) {
        console.warn('Failed to parse resume.content for download, using raw value', e);
        content = raw || {};
      }
      const template = resume.template || 'modern';
      
      const payload = { data: content, template, format: 'pdf' };
      const response = await generateResume(payload);

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resume.title || 'resume'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "PDF downloaded successfully!",
      });
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast({
        title: "Error",
        description: "Failed to download PDF",
        variant: "destructive",
      });
    }
  };

  const handleGenerateResume = async () => {
    setGenerating(true);
    try {
      // Always generate from live profile
      const payload = { fromProfile: true, template: selectedTemplate, format: 'pdf' };
      const response = await generateResume(payload);

      // response is a Blob (application/pdf)
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');

      toast({
        title: "Success",
        description: "Resume generated successfully!",
      });
    } catch (error) {
      console.error('Error generating resume:', error);
      toast({
        title: "Error",
        description: "Failed to generate resume",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const handlePreviewResume = async () => {
    try {
      // Always preview from live profile
      const payload = { fromProfile: true, template: selectedTemplate };
      const response = await previewResume(payload);

      // Expect { success, data: { html } }
      const html = response?.data?.data?.html;
      if (html) {
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      } else {
        throw new Error('No preview HTML returned');
      }
    } catch (error) {
      console.error('Error previewing resume:', error);
      toast({
        title: "Error",
        description: "Failed to preview resume",
        variant: "destructive",
      });
    }
  };

  const handleSaveResume = async () => {
    setLoading(true);
    try {
      // Save the current form (mapped to backend schema) so edits (education, experience, etc.) persist
      const mapped = mapToBackendSchema(resumeData);
      
      // If editing a snapshot, update that specific resume instead of creating new
      if (isEditingSnapshot && editingResumeId) {
        const payload = {
          data: mapped,
          template: selectedTemplate,
          title: editingResumeTitle || undefined
        };
        console.log('[ResumeBuilder] Updating existing resume id=', editingResumeId, 'payload=', payload);
        await updateResume(editingResumeId, payload);
      } else {
        // Create new resume snapshot
        const payload = { data: mapped, template: selectedTemplate };
        console.log('[ResumeBuilder] Creating new snapshot:', payload);
        await saveResume(payload);
      }

      // Also update profile entities if not in edit mode
      if (!isEditingSnapshot) {
        await syncProfileFromResumeData();
      }
      
      toast({
        title: "Success",
        description: isEditingSnapshot ? "Resume snapshot updated successfully!" : "Resume saved successfully!",
      });
      
      fetchSavedResumes();
    } catch (error) {
      console.error('Error saving resume:', error);
      toast({
        title: "Error",
        description: "Failed to save resume",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Map the client-side resume model to the backend template schema
  const mapToBackendSchema = (data) => {
    // Combine name parts into a single fullName for backend templates
    const combinedFullName = ([data.personalInfo?.first_name, data.personalInfo?.second_name, data.personalInfo?.last_name].filter(Boolean).join(' ') || data.personalInfo?.fullName || '').trim();

    const personalInfo = {
      ...data.personalInfo,
      fullName: combinedFullName,
      // Backend templates expect summary under personalInfo
      summary: data.summary || data.personalInfo?.summary || '',
      // Classic template uses address; map location to address if provided
      address: data.personalInfo?.location || data.personalInfo?.address || ''
    };

    // Experience: backend expects `experience` array
    const experience = (data.experiences || []).map(exp => ({
      title: exp.title || '',
      company: exp.company || '',
      location: exp.location || '',
      startDate: exp.startDate || '',
      endDate: exp.current ? '' : (exp.endDate || ''),
      current: !!exp.current,
      description: exp.description || ''
    }));

    // Education: backend template references `graduationDate`
    const education = (data.education || []).map(edu => ({
      degree: edu.degree || '',
      institution: edu.institution || '',
      location: edu.location || '',
      graduationDate: edu.endYear || edu.startYear || '',
      gpa: edu.gpa || '',
      description: edu.description || ''
    }));

    // Skills: template expects objects with { name, level }
    const skills = (data.skills || []).map(s => (
      typeof s === 'string' ? { name: s, level: 'Intermediate' } : (s.name ? s : { name: String(s), level: 'Intermediate' })
    ));

    return {
      personalInfo,
      experience,
      education,
      skills,
      languages: data.languages || [],
      certifications: data.certifications || [],
      projects: data.projects || []
    };
  };

  // Populate the local form from the user's profile and related entities
  const populateFromProfile = async () => {
    try {
      const [profileRes, expRes, eduRes, skillsRes] = await Promise.all([
        getUserProfile(),
        getUserExperiences(),
        getUserEducation(),
        getUserSkills()
      ]);

      const profile = profileRes?.data || {};
      const experiences = Array.isArray(expRes?.data) ? expRes.data : (expRes?.data?.experiences || []);
      const education = Array.isArray(eduRes?.data) ? eduRes.data : (eduRes?.data?.educations || eduRes?.data?.education || []);
      const userSkills = Array.isArray(skillsRes?.data) ? skillsRes.data : (skillsRes?.data?.skills || []);

      // Map server profile shape to local resumeData structure
      const personalInfo = {
        first_name: profile.first_name || '',
        second_name: profile.second_name || '',
        last_name: profile.last_name || '',
        // keep combined fullName for downstream mapping
        fullName: [profile.first_name, profile.second_name, profile.last_name].filter(Boolean).join(' ') || profile.fullName || '',
        email: profile.email || '',
        phone: profile.mobile || profile.phone || '',
        location: profile.city?.name || profile.address || '',
        linkedin: profile.linkedin_url || (profile.social && profile.social.linkedin) || '',
        website: profile.website || ''
      };

      const mappedExperiences = (experiences || []).map(e => ({
        title: e.position || e.title || '',
        company: e.company_name || '',
        location: e.location || '',
        startDate: e.start_date ? e.start_date.slice(0,7) : (e.startDate ? e.startDate : ''),
        endDate: e.end_date ? e.end_date.slice(0,7) : (e.endDate ? e.endDate : ''),
        current: !!e.currently_working,
        description: e.description || ''
      }));

      const mappedEducation = (education || []).map(ed => ({
        degree: ed.degree || '',
        institution: ed.institution || '',
        location: ed.location || '',
        startYear: ed.start_year || (ed.startDate ? String(ed.startDate).slice(0, 4) : ''),
        endYear: ed.end_year || (ed.endDate ? String(ed.endDate).slice(0, 4) : ''),
        gpa: ed.gpa || '',
        description: ed.description || ''
      }));

      const mappedSkills = (userSkills || []).map(s => (typeof s === 'string' ? s : (s.skill_name || s.name?.en || s.name || s.skill?.name || ''))).filter(Boolean);

      setResumeData(prev => ({
        ...prev,
        personalInfo,
        experiences: mappedExperiences,
        education: mappedEducation,
        skills: mappedSkills
      }));
      console.debug('[ResumeBuilder] mappedSkills from profile:', mappedSkills);
      console.debug('[ResumeBuilder] populated personalInfo:', personalInfo);

      toast({ title: 'Profile loaded', description: 'Form populated from your profile data.' });
    } catch (err) {
      console.error('Error loading profile data:', err);
      toast({ title: 'Error', description: 'Failed to load profile data', variant: 'destructive' });
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Resume Builder
        </h1>
        <p className="text-muted-foreground">
          Create a professional resume with our AI-powered builder
        </p>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="build">Build Resume</TabsTrigger>
          <TabsTrigger value="upload">Upload CV</TabsTrigger>
          <TabsTrigger value="saved">Saved Resumes ({savedResumes.length})</TabsTrigger>
        </TabsList>

        {/* Build Resume Tab */}
        <TabsContent value="build" className="space-y-6">
          {/* Edit Mode Banner */}
          {isEditingSnapshot && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Edit className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="font-semibold text-amber-900">Editing Resume Snapshot</p>
                  <p className="text-sm text-amber-700">{editingResumeTitle}</p>
                </div>
              </div>
              <Button
                onClick={() => {
                  setIsEditingSnapshot(false);
                  setEditingResumeId(null);
                  setEditingResumeTitle('');
                  populateFromProfile(); // Reload from profile
                }}
                variant="outline"
                size="sm"
              >
                Cancel Editing
              </Button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 items-center">
            <Button 
              onClick={handlePreviewResume}
              variant="outline"
              className="gap-2"
            >
              <Eye className="h-4 w-4" />
              Preview
            </Button>

            {/* Template Selector */}
            <div className="flex items-center gap-2">
              <Label htmlFor="templateSelect" className="text-sm whitespace-nowrap">Template:</Label>
              <select
                id="templateSelect"
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="border rounded px-3 py-2 text-sm"
              >
                <option value="modern">Modern</option>
                <option value="classic">Classic</option>
                <option value="minimal">Minimal</option>
                <option value="creative">Creative</option>
              </select>
            </div>

            {/* Right-aligned action group: Save + Generate */}
            <div className="ml-auto flex items-center gap-3">
              {/* Show Update Profile button when editing a snapshot */}
              {isEditingSnapshot && (
                <Button 
                  onClick={handleUpdateProfile}
                  className="gap-2 bg-amber-600 hover:bg-amber-700"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  Update Profile
                </Button>
              )}

              <Button 
                onClick={handleSaveResume}
                variant="outline"
                className="gap-2"
                disabled={loading}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save
              </Button>

              <Button 
                onClick={handleGenerateResume}
                className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700 gap-2"
                disabled={generating}
              >
                {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                Generate PDF
              </Button>
            </div>
          </div>

          {/* Personal Information */}
          <Card className="border-l-4 border-l-cyan-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-cyan-600" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      value={resumeData.personalInfo.first_name}
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, first_name: e.target.value }
                      }))}
                      placeholder="First"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondName">Second name</Label>
                    <Input
                      id="secondName"
                      value={resumeData.personalInfo.second_name}
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, second_name: e.target.value }
                      }))}
                      placeholder="Second"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Family name</Label>
                    <Input
                      id="lastName"
                      value={resumeData.personalInfo.last_name}
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, last_name: e.target.value }
                      }))}
                      placeholder="Family"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={resumeData.personalInfo.email}
                    onChange={(e) => setResumeData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, email: e.target.value }
                    }))}
                    placeholder="john@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={resumeData.personalInfo.phone}
                    onChange={(e) => setResumeData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, phone: e.target.value }
                    }))}
                    placeholder="+1 234 567 8900"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={resumeData.personalInfo.location}
                    onChange={(e) => setResumeData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, location: e.target.value }
                    }))}
                    placeholder="City, Country"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={resumeData.personalInfo.linkedin}
                    onChange={(e) => setResumeData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, linkedin: e.target.value }
                    }))}
                    placeholder="linkedin.com/in/yourprofile"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website/Portfolio</Label>
                  <Input
                    id="website"
                    value={resumeData.personalInfo.website}
                    onChange={(e) => setResumeData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, website: e.target.value }
                    }))}
                    placeholder="www.yourwebsite.com"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Summary */}
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle>Professional Summary</CardTitle>
              <CardDescription>
                Write a brief overview of your professional background
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={resumeData.summary}
                onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
                placeholder="Experienced professional with..."
                rows={5}
              />
            </CardContent>
          </Card>

          {/* Work Experience */}
          <Card className="border-l-4 border-l-cyan-500">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-cyan-600" />
                  Work Experience
                </div>
                <Button onClick={handleAddExperience} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Experience
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {resumeData.experiences.length > 0 ? (
                <Accordion type="single" collapsible value={openExp} onValueChange={setOpenExp}>
                  {resumeData.experiences.map((exp, index) => (
                    <AccordionItem key={index} value={`exp-${index}`}>
                      <div id={`exp-${index}`}>
                        <AccordionTrigger>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
                            <div>
                              <div className="font-medium">{exp.title || `Experience ${index + 1}`}{exp.company ? ` — ${exp.company}` : ''}</div>
                              <div className="text-xs text-muted-foreground">{exp.location || ''}</div>
                            </div>
                            <div className="text-sm text-muted-foreground mt-2 sm:mt-0">
                              {exp.startDate ? exp.startDate : ''}{exp.startDate && ' - '}{exp.current ? 'Present' : (exp.endDate || '')}
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4 pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Job Title *</Label>
                          <Input
                            value={exp.title}
                            onChange={(e) => handleExperienceChange(index, 'title', e.target.value)}
                            placeholder="Software Engineer"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Company *</Label>
                          <Input
                            value={exp.company}
                            onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                            placeholder="Tech Corp"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Location</Label>
                          <Input
                            value={exp.location}
                            onChange={(e) => handleExperienceChange(index, 'location', e.target.value)}
                            placeholder="New York, NY"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Start Date</Label>
                          <Input
                            type="month"
                            value={exp.startDate}
                            onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>End Date</Label>
                          <Input
                            type="month"
                            value={exp.endDate}
                            onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                            disabled={exp.current}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`current-${index}`}
                            checked={exp.current}
                            onChange={(e) => handleExperienceChange(index, 'current', e.target.checked)}
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor={`current-${index}`}>I currently work here</Label>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={exp.description}
                          onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                          placeholder="Describe your responsibilities and achievements..."
                          rows={4}
                        />
                      </div>
                      <Button 
                        onClick={() => handleRemoveExperience(index)}
                        variant="destructive"
                        size="sm"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </AccordionContent>
                      </div>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No work experience added yet. Click "Add Experience" to get started.
                </div>
              )}
              
            </CardContent>
          </Card>

          {/* Education */}
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 ${themeColors.iconBackgrounds.primary.split(' ')[1]}" />
                  Education
                </div>
                <Button onClick={handleAddEducation} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Education
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                  {resumeData.education.length > 0 ? (
                    <Accordion type="single" collapsible value={openEdu} onValueChange={setOpenEdu}>
                      {resumeData.education.map((edu, index) => (
                        <AccordionItem key={index} value={`edu-${index}`}>
                          <div id={`edu-${index}`}>
                            <AccordionTrigger>
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
                                <div>
                                  <div className="font-medium">{edu.degree || `Education ${index + 1}`}{edu.institution ? ` — ${edu.institution}` : ''}</div>
                                  <div className="text-xs text-muted-foreground">{edu.location || ''}</div>
                                </div>
                                <div className="text-sm text-muted-foreground mt-2 sm:mt-0">
                                  {edu.startYear ? edu.startYear : ''}{edu.startYear && ' - '}{edu.endYear || ''}
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-4 pt-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>Degree *</Label>
                                  <Input
                                    value={edu.degree}
                                    onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                                    placeholder="Bachelor of Science"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Institution *</Label>
                                  <Input
                                    value={edu.institution}
                                    onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                                    placeholder="University Name"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Location</Label>
                                  <Input
                                    value={edu.location}
                                    onChange={(e) => handleEducationChange(index, 'location', e.target.value)}
                                    placeholder="City, Country"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Start Year</Label>
                                  <Input
                                    type="number"
                                    value={edu.startYear}
                                    onChange={(e) => handleEducationChange(index, 'startYear', e.target.value)}
                                    placeholder="2018"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>End Year</Label>
                                  <Input
                                    type="number"
                                    value={edu.endYear}
                                    onChange={(e) => handleEducationChange(index, 'endYear', e.target.value)}
                                    placeholder="2022"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>GPA (Optional)</Label>
                                  <Input
                                    value={edu.gpa}
                                    onChange={(e) => handleEducationChange(index, 'gpa', e.target.value)}
                                    placeholder="3.8/4.0"
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label>Additional Details</Label>
                                <Textarea
                                  value={edu.description}
                                  onChange={(e) => handleEducationChange(index, 'description', e.target.value)}
                                  placeholder="Relevant coursework, honors, etc..."
                                  rows={3}
                                />
                              </div>
                              <Button 
                                onClick={() => handleRemoveEducation(index)}
                                variant="destructive"
                                size="sm"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove
                              </Button>
                            </AccordionContent>
                          </div>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  ) : null}
            </CardContent>
          </Card>

          {/* Skills */}
          <Card className="border-l-4 border-l-cyan-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-cyan-600" />
                Skills
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 items-center">
                {/* Category filter (always render; disabled when no categories available) */}
                <select
                  value={skillCategoryFilter}
                  onChange={(e) => setSkillCategoryFilter(e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                  aria-label="Filter skills by category"
                  disabled={availableSkillCategories.length === 0}
                >
                  <option value="">All categories</option>
                  {availableSkillCategories.length === 0 ? (
                    <option value="" disabled>— no categories —</option>
                  ) : (
                    availableSkillCategories.map((c, i) => <option key={i} value={c}>{c}</option>)
                  )}
                </select>

                {/* Skill type filter rendered as a dropdown with icons */}
                <div className="relative" ref={typeDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setTypeDropdownOpen(v => !v)}
                    className={`flex items-center gap-2 px-3 py-1 rounded border text-sm ${typeDropdownOpen ? 'bg-gray-100' : ''}`}
                    aria-haspopup="listbox"
                    aria-expanded={typeDropdownOpen}
                    disabled={allSkillTypes.length === 0}
                  >
                    {skillTypeFilter ? (
                      <>
                        {(() => { const Icon = getTypeIcon(skillTypeFilter); return <Icon className="h-4 w-4" />; })()}
                        <span>{getTypeLabel(skillTypeFilter)}</span>
                      </>
                    ) : (
                      <span>{localize('All types')}</span>
                    )}
                    <ChevronDown className="h-4 w-4 ml-2 text-muted-foreground" />
                  </button>

                  {/* Dropdown menu */}
                  {typeDropdownOpen && (
                    <div className="absolute mt-2 bg-white border rounded shadow z-50 min-w-[200px]">
                      <div className="flex flex-col">
                        <button
                          type="button"
                          onClick={() => { setSkillTypeFilter(''); setTypeDropdownOpen(false); }}
                          className={`text-left px-3 py-2 hover:bg-gray-50 ${skillTypeFilter === '' ? 'bg-gray-100' : ''} text-xs`}
                        >
                          <span className="text-xs">All types</span>
                        </button>
                        {allSkillTypes.map((t, i) => {
                          const Icon = getTypeIcon(t);
                          const label = getTypeLabel(t);
                          const count = getTypeCount(t);
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={() => { setSkillTypeFilter(t); setTypeDropdownOpen(false); }}
                              className={`text-left px-3 py-2 hover:bg-gray-50 ${String(skillTypeFilter) === String(t) ? 'bg-gray-100' : ''}`}
                            >
                              <div className="flex items-center gap-2">
                                  <Icon className="h-3 w-3" />
                                  <span className="text-xs">{label}{count === 0 ? ` (${count})` : ''}</span>
                                </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
                {/* Debug hint removed: no need to display sample skill when categories/types are missing */}

                {/* Dropdown select populated from availableSkills (filtered) */}
                <div className="flex items-center gap-2">
                  <select
                    id="skillSelect"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    className="border rounded px-3 py-1 text-sm"
                    aria-label="Select a skill"
                    disabled={fetchingSkills || !Array.isArray(availableSkills) || availableSkills.length === 0}
                  >
                    <option value="">Select a skill</option>
                    {Array.isArray(availableSkills) ? availableSkills
                      .filter(s => {
                        // exclude already-added skills by name
                        const name = (extractSkillName(s) || '').toLowerCase();
                        if (addedSkillNames.has(name)) return false;

                        // determine category name (localized) for this skill
                        const cand = s?.category ?? s?.ctg ?? (s?.skill && s.skill.category) ?? (Array.isArray(s?.categories) ? s.categories[0] : null);
                        let catName = '';
                        if (cand) {
                          if (typeof cand === 'string') {
                            const catObj = categoriesMap[cand];
                            catName = catObj ? localize(catObj.name) : cand;
                          } else if (typeof cand === 'object') {
                            catName = localize(cand.name ?? cand.title ?? cand.label) || extractSkillCategory(s);
                          }
                        }
                        if (skillCategoryFilter) {
                          if (String(catName) !== String(skillCategoryFilter)) return false;
                        }

                        // determine type for this skill via its category
                        let typeName = '';
                        if (cand) {
                          if (typeof cand === 'string') {
                            const catObj = categoriesMap[cand];
                            if (catObj) typeName = String(catObj.skill_type || catObj.type || '');
                          } else if (typeof cand === 'object') {
                            typeName = String(cand.skill_type || cand.type || '');
                          }
                        }
                        if (!typeName) typeName = extractSkillType(s);
                        if (skillTypeFilter) {
                          if (String(typeName) !== String(skillTypeFilter)) return false;
                        }

                        return true;
                      })
                      .map((s, i) => {
                        const val = extractSkillName(s) || '';
                        return <option key={i} value={val}>{val}</option>;
                      }) : null}
                  </select>

                  <Button size="sm" onClick={() => { fetchAvailableSkills(); }} disabled={fetchingSkills}>
                    {fetchingSkills ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Refresh'}
                  </Button>
                </div>
                <Button size="sm" onClick={() => { if (skillInput) { handleAddSkill(skillInput); setSkillInput(''); } }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(resumeData.skills) && resumeData.skills.map((skill, index) => {
                    const display = extractSkillName(skill) || 'Unnamed Skill';
                    return (
                      <Badge key={index} variant="secondary" className="gap-2 px-3 py-1">
                        {display}
                        <button onClick={() => handleRemoveSkill(skill)}>
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </Badge>
                    );
                  })}
              </div>
              {/* Helpful hint if no options are available */}
              {(!fetchingSkills && Array.isArray(availableSkills) && availableSkills.length === 0) && (
                <div className="text-sm text-muted-foreground mt-2">
                  {skillsFetchError ? (
                    <span>No skills available: {skillsFetchError}. Try refreshing.</span>
                  ) : (
                    <span>No skills returned from server. Click "Refresh" to retry.</span>
                  )}
                </div>
              )}
              {resumeData.skills.length === 0 && (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  No skills added yet. Type a skill above and press Enter.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Upload CV Tab */}
        <TabsContent value="upload">
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 ${themeColors.iconBackgrounds.primary.split(' ')[1]}" />
                Upload Existing CV
              </CardTitle>
              <CardDescription>
                Upload your CV and we'll extract the information automatically
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <input
                  type="file"
                  id="cv-upload"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={extracting}
                />
                <label htmlFor="cv-upload" className="cursor-pointer">
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-cyan-100 to-purple-100 rounded-full flex items-center justify-center">
                      {extracting ? (
                        <Loader2 className="h-8 w-8 animate-spin ${themeColors.iconBackgrounds.primary.split(' ')[1]}" />
                      ) : (
                        <Upload className="h-8 w-8 ${themeColors.iconBackgrounds.primary.split(' ')[1]}" />
                      )}
                    </div>
                    <div>
                      <p className="text-lg font-semibold">
                        {extracting ? 'Extracting data...' : 'Upload your CV'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {extracting ? 'Please wait while we process your document' : 'PDF, DOC, or DOCX (Max 5MB)'}
                      </p>
                    </div>
                    {!extracting && (
                      <Button className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700">
                        Choose File
                      </Button>
                    )}
                  </div>
                </label>
              </div>

              {extracting && progress > 0 && (
                <div className="space-y-2">
                  <Progress value={progress} className="h-2" />
                  <p className="text-sm text-center text-muted-foreground">{progress}% complete</p>
                </div>
              )}

              {selectedFile && !extracting && (
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <File className="h-8 w-8 text-cyan-600" />
                  <div className="flex-grow">
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Badge variant="secondary">Uploaded</Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Saved Resumes Tab */}
        <TabsContent value="saved">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedResumes.length > 0 ? (
              savedResumes.map((resume, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{resume.title || 'Untitled Resume'}</CardTitle>
                    <CardDescription>
                      Last updated: {new Date(resume.updatedAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handlePreviewSaved(resume)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleEditResume(resume)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleDownloadSaved(resume)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="col-span-full text-center py-12">
                <CardContent>
                  <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No saved resumes</h3>
                  <p className="text-muted-foreground mb-4">
                    Create and save your first resume to get started
                  </p>
                  <Button 
                    onClick={() => setActiveTab('build')}
                    className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700"
                  >
                    Build Resume
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* CV Extraction Results Dialog */}
      <Dialog open={extractionDialogOpen} onOpenChange={setExtractionDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>CV Extraction Results</DialogTitle>
            <DialogDescription>
              Review the extracted information and choose how to proceed
            </DialogDescription>
          </DialogHeader>
          
          {extractedData && (
            <div className="space-y-6">
              {/* Personal Info Section */}
              {extractedData.personalInfo && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Personal Information
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                    {extractedData.personalInfo.fullName && (
                      <p><span className="font-medium">Name:</span> {extractedData.personalInfo.fullName}</p>
                    )}
                    {extractedData.personalInfo.email && (
                      <p><span className="font-medium">Email:</span> {extractedData.personalInfo.email}</p>
                    )}
                    {extractedData.personalInfo.phone && (
                      <p><span className="font-medium">Phone:</span> {extractedData.personalInfo.phone}</p>
                    )}
                    {extractedData.personalInfo.location && (
                      <p><span className="font-medium">Location:</span> {extractedData.personalInfo.location}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Summary Section */}
              {extractedData.summary && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Summary</h3>
                  <div className="bg-gray-50 p-4 rounded-lg text-sm">
                    <p>{extractedData.summary}</p>
                  </div>
                </div>
              )}

              {/* Experience Section */}
              {extractedData.experiences && extractedData.experiences.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Experience ({extractedData.experiences.length})
                  </h3>
                  <div className="space-y-3">
                    {extractedData.experiences.map((exp, idx) => (
                      <div key={idx} className="bg-gray-50 p-4 rounded-lg text-sm">
                        <p className="font-medium">{exp.title} {exp.company && `at ${exp.company}`}</p>
                        {exp.startDate && <p className="text-gray-600">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>}
                        {exp.description && <p className="mt-2">{exp.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education Section */}
              {extractedData.education && extractedData.education.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Education ({extractedData.education.length})
                  </h3>
                  <div className="space-y-3">
                    {extractedData.education.map((edu, idx) => (
                      <div key={idx} className="bg-gray-50 p-4 rounded-lg text-sm">
                        <p className="font-medium">{edu.degree}</p>
                        <p className="text-gray-600">{edu.institution} {edu.graduationDate && `• ${edu.graduationDate}`}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills Section */}
              {extractedData.skills && extractedData.skills.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Skills ({extractedData.skills.length})
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex flex-wrap gap-2">
                      {extractedData.skills.map((skill, idx) => (
                        <Badge key={idx} variant="secondary">
                          {typeof skill === 'string' ? skill : skill.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={handlePopulateToProfile}
                  className="flex-1 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                  Populate to Profile
                </Button>
                <Button
                  onClick={handleSaveAsNewResume}
                  variant="outline"
                  className="flex-1"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  Save as New Resume
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
