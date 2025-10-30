import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb.jsx';
import { Home } from 'lucide-react';

const BreadcrumbNav = ({ customBreadcrumbs }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const generateBreadcrumbs = () => {
    if (customBreadcrumbs) return customBreadcrumbs;

    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    const group = params.get('group');
    const pathParts = location.pathname.split('/').filter(Boolean);

    const breadcrumbs = [
      { label: 'Home', path: '/', icon: Home },
    ];

    if (pathParts.includes('jobseeker-tabs')) {
      breadcrumbs.push({ label: 'Job Seeker', path: '/jobseeker-tabs' });
      if (group) {
        breadcrumbs.push({
          label: group.charAt(0).toUpperCase() + group.slice(1),
          path: `/jobseeker-tabs?group=${group}`,
        });
      }
      if (tab) {
        breadcrumbs.push({
          label: tab.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
          path: `/jobseeker-tabs?group=${group}&tab=${tab}`,
          current: true,
        });
      }
    } else if (pathParts.includes('employer-tabs')) {
      breadcrumbs.push({ label: 'Employer', path: '/employer-tabs' });
      if (group) {
        breadcrumbs.push({
          label: group.charAt(0).toUpperCase() + group.slice(1),
          path: `/employer-tabs?group=${group}`,
        });
      }
      if (tab) {
        breadcrumbs.push({
          label: tab.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
          path: `/employer-tabs?group=${group}&tab=${tab}`,
          current: true,
        });
      }
    } else {
      pathParts.forEach((part, index) => {
        breadcrumbs.push({
          label: part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' '),
          path: `/${pathParts.slice(0, index + 1).join('/')}`,
          current: index === pathParts.length - 1,
        });
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              {crumb.current ? (
                <BreadcrumbPage className="flex items-center gap-1.5">
                  {crumb.icon && <crumb.icon className="h-4 w-4" />}
                  {crumb.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink
                  onClick={() => navigate(crumb.path)}
                  className="flex items-center gap-1.5 cursor-pointer"
                >
                  {crumb.icon && <crumb.icon className="h-4 w-4" />}
                  {crumb.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbNav;
