import i18n from 'i18next';
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/UI/card.jsx";
import { Button } from "@/components/UI/button.jsx";
import { Input } from "@/components/UI/input.jsx";
import { Label } from "@/components/UI/label.jsx";
import { Textarea } from "@/components/UI/textarea.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/UI/select.jsx";
import { Checkbox } from "@/components/UI/checkbox.jsx";
import { useToast } from "@/hooks/use-toast";
import { postJob } from "@/services/api";
import themeColors from "@/config/theme-colors-employer";
import { Briefcase, MapPin, DollarSign, Clock, FileText, CheckCircle, Loader2 } from "lucide-react";

const JobPostingForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    jobTitle: "",
    jobDescription: "",
    location: "",
    minSalary: "",
    maxSalary: "",
    employmentType: "",
    requirements: "",
    remoteWorkAllowed: false,
  });

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const jobData = {
        title: formData.jobTitle,
        description: formData.jobDescription,
        location: formData.location,
        salary_min: formData.minSalary ? parseInt(formData.minSalary) : undefined,
        salary_max: formData.maxSalary ? parseInt(formData.maxSalary) : undefined,
        employment_type: formData.employmentType,
        requirements: formData.requirements,
        remote_ok: formData.remoteWorkAllowed,
      };

      await postJob(jobData);
      
      toast({
        title: "Success!",
        description: "Job posting created successfully!",
      });
      
      // Reset form
      setFormData({
        jobTitle: "",
        jobDescription: "",
        location: "",
        minSalary: "",
        maxSalary: "",
        employmentType: "",
        requirements: "",
        remoteWorkAllowed: false,
      });
    } catch (error) {
      console.error("Error posting job:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create job posting. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className={`${themeColors.text.gradient} text-4xl font-bold mb-2 `}>{i18n.t('auto_post_a_new_job')}</h1>
        <p className="text-muted-foreground">
          Fill out the details below to create a new job posting and attract top talent.
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className={`h-5 w-5 ${themeColors.iconBackgrounds.primary.split(' ')[1]}`} />{i18n.t('auto_job_details')}</CardTitle>
          <CardDescription>
            Provide comprehensive information about the position you're hiring for.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Job Title */}
            <div className="space-y-2">
              <Label htmlFor="jobTitle" className="text-base font-semibold">{i18n.t('auto_job_title')}<span className="text-destructive">*</span>
              </Label>
              <Input
                id="jobTitle"
                placeholder={i18n.t('auto_e_g_senior_software_engineer')} 
                value={formData.jobTitle}
                onChange={(e) => handleChange("jobTitle", e.target.value)}
                required
                className="text-base"
              />
            </div>

            {/* Job Description */}
            <div className="space-y-2">
              <Label htmlFor="jobDescription" className="text-base font-semibold">{i18n.t('auto_job_description')}<span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="jobDescription"
                placeholder={i18n.t('auto_describe_the_role_responsibilities_and_w')} 
                value={formData.jobDescription}
                onChange={(e) => handleChange("jobDescription", e.target.value)}
                rows={6}
                required
                className="text-base"
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location" className="text-base font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4" />{i18n.t('auto_location')}<span className="text-destructive">*</span>
              </Label>
              <Input
                id="location"
                placeholder={i18n.t('auto_e_g_new_york_ny_or_remote')} 
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                required
                className="text-base"
              />
            </div>

            {/* Salary Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minSalary" className="text-base font-semibold flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />{i18n.t('auto_minimum_salary')}</Label>
                <Input
                  id="minSalary"
                  type="number"
                  placeholder={i18n.t('auto_e_g_50000')} 
                  value={formData.minSalary}
                  onChange={(e) => handleChange("minSalary", e.target.value)}
                  className="text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxSalary" className="text-base font-semibold flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />{i18n.t('auto_maximum_salary')}</Label>
                <Input
                  id="maxSalary"
                  type="number"
                  placeholder={i18n.t('auto_e_g_90000')} 
                  value={formData.maxSalary}
                  onChange={(e) => handleChange("maxSalary", e.target.value)}
                  className="text-base"
                />
              </div>
            </div>

            {/* Employment Type */}
            <div className="space-y-2">
              <Label htmlFor="employmentType" className="text-base font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4" />{i18n.t('auto_employment_type')}<span className="text-destructive">*</span>
              </Label>
              <Select 
                value={formData.employmentType} 
                onValueChange={(value) => handleChange("employmentType", value)}
                required
              >
                <SelectTrigger id="employmentType" className="text-base">
                  <SelectValue placeholder={i18n.t('auto_select_employment_type')}  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">{i18n.t('auto_full_time')}</SelectItem>
                  <SelectItem value="part-time">{i18n.t('auto_part_time')}</SelectItem>
                  <SelectItem value="contract">{i18n.t('auto_contract')}</SelectItem>
                  <SelectItem value="internship">{i18n.t('auto_internship')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Requirements */}
            <div className="space-y-2">
              <Label htmlFor="requirements" className="text-base font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4" />{i18n.t('auto_requirements_1')}<span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="requirements"
                placeholder={i18n.t('auto_list_required_skills_qualifications_and_')} 
                value={formData.requirements}
                onChange={(e) => handleChange("requirements", e.target.value)}
                rows={5}
                required
                className="text-base"
              />
            </div>

            {/* Remote Work Checkbox */}
            <div className="flex items-center space-x-2 p-4 bg-muted/50 rounded-lg">
              <Checkbox
                id="remoteWorkAllowed"
                checked={formData.remoteWorkAllowed}
                onCheckedChange={(checked) => handleChange("remoteWorkAllowed", checked)}
              />
              <Label
                htmlFor="remoteWorkAllowed"
                className="text-base font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >{i18n.t('auto_remote_work_allowed')}</Label>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                className={`${themeColors.buttons.primary} text-white w-full  text-lg py-6`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />{i18n.t('auto_posting_job')}</>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />{i18n.t('auto_post_job')}</>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobPostingForm;
