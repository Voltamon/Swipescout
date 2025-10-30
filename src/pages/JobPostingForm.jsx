import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Textarea } from "@/components/ui/textarea.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { Checkbox } from "@/components/ui/checkbox.jsx";
import { useToast } from "@/hooks/use-toast";
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
    
    // Simulate API call
    setTimeout(() => {
      console.log("Form submitted:", formData);
      toast({
        title: "Success!",
        description: "Job posting created successfully!",
      });
      setLoading(false);
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
    }, 1500);
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className={`${themeColors.text.gradient} text-4xl font-bold mb-2 `}>
          Post a New Job
        </h1>
        <p className="text-muted-foreground">
          Fill out the details below to create a new job posting and attract top talent.
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className={`h-5 w-5 ${themeColors.iconBackgrounds.primary.split(' ')[1]}`} />
            Job Details
          </CardTitle>
          <CardDescription>
            Provide comprehensive information about the position you're hiring for.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Job Title */}
            <div className="space-y-2">
              <Label htmlFor="jobTitle" className="text-base font-semibold">
                Job Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="jobTitle"
                placeholder="e.g. Senior Software Engineer"
                value={formData.jobTitle}
                onChange={(e) => handleChange("jobTitle", e.target.value)}
                required
                className="text-base"
              />
            </div>

            {/* Job Description */}
            <div className="space-y-2">
              <Label htmlFor="jobDescription" className="text-base font-semibold">
                Job Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="jobDescription"
                placeholder="Describe the role, responsibilities, and what makes this position unique..."
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
                <MapPin className="h-4 w-4" />
                Location <span className="text-destructive">*</span>
              </Label>
              <Input
                id="location"
                placeholder="e.g. New York, NY or Remote"
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
                  <DollarSign className="h-4 w-4" />
                  Minimum Salary
                </Label>
                <Input
                  id="minSalary"
                  type="number"
                  placeholder="e.g. 50000"
                  value={formData.minSalary}
                  onChange={(e) => handleChange("minSalary", e.target.value)}
                  className="text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxSalary" className="text-base font-semibold flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Maximum Salary
                </Label>
                <Input
                  id="maxSalary"
                  type="number"
                  placeholder="e.g. 90000"
                  value={formData.maxSalary}
                  onChange={(e) => handleChange("maxSalary", e.target.value)}
                  className="text-base"
                />
              </div>
            </div>

            {/* Employment Type */}
            <div className="space-y-2">
              <Label htmlFor="employmentType" className="text-base font-semibold flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Employment Type <span className="text-destructive">*</span>
              </Label>
              <Select 
                value={formData.employmentType} 
                onValueChange={(value) => handleChange("employmentType", value)}
                required
              >
                <SelectTrigger id="employmentType" className="text-base">
                  <SelectValue placeholder="Select employment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Requirements */}
            <div className="space-y-2">
              <Label htmlFor="requirements" className="text-base font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Requirements <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="requirements"
                placeholder="List required skills, qualifications, and experience..."
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
              >
                Remote work allowed
              </Label>
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
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Posting Job...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Post Job
                  </>
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
