import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createSupportTicket, getUserTickets } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/UI/card';
import { Button } from '@/components/UI/button';
import { Input } from '@/components/UI/input';
import { Textarea } from '@/components/UI/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/UI/select';
import { Badge } from '@/components/UI/badge';
import { Loader2, MessageSquare, Star, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import i18n from 'i18next';

export default function SupportPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    category: 'general',
    message: ''
  });

  const isPriority = user?.subscriptionPlan === 'PROFESSIONAL' || 
                     user?.subscriptionPlan === 'PREMIUM' || 
                     user?.subscriptionPlan === 'BUSINESS' || 
                     user?.subscriptionPlan === 'ENTERPRISE';

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const data = await getUserTickets();
      if (data.success) {
        setTickets(data.tickets);
      }
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createSupportTicket(formData);
      toast({
        title: "Ticket Created",
        description: "We have received your support request.",
      });
      setFormData({ subject: '', category: 'general', message: '' });
      fetchTickets();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create ticket. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{i18n.t('auto_support_center')}</h1>
          <p className="text-slate-600">{i18n.t('auto_get_help_with_your_account_or_report_iss')}</p>
        </div>
        {isPriority && (
          <Badge className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 text-sm flex items-center gap-1">
            <Star className="h-4 w-4 fill-current" />{i18n.t('auto_priority_support_active')}</Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{i18n.t('auto_new_support_request')}</CardTitle>
              <CardDescription>
                {isPriority 
                  ? "Your ticket will be flagged for priority handling." 
                  : "Submit a request and our team will get back to you."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{i18n.t('auto_category')}</label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(val) => setFormData({...formData, category: val})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={i18n.t('auto_select_category')}  />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">{i18n.t('auto_general_inquiry')}</SelectItem>
                        <SelectItem value="technical">{i18n.t('auto_technical_issue')}</SelectItem>
                        <SelectItem value="billing">Billing & Subscription</SelectItem>
                        <SelectItem value="feature">{i18n.t('auto_feature_request')}</SelectItem>
                        <SelectItem value="bug">{i18n.t('auto_report_a_bug')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{i18n.t('subject')}</label>
                    <Input 
                      placeholder={i18n.t('auto_brief_summary_of_the_issue')} 
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{i18n.t('auto_message')}</label>
                  <Textarea 
                    placeholder={i18n.t('auto_describe_your_issue_in_detail')} 
                    className="min-h-[150px]"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    required
                  />
                </div>
                <Button type="submit" disabled={submitting} className="w-full">
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <MessageSquare className="h-4 w-4 mr-2" />}
                  Submit Ticket
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{i18n.t('auto_your_tickets')}</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                </div>
              ) : tickets.length === 0 ? (
                <div className="text-center p-4 text-slate-500">{i18n.t('auto_no_tickets_found')}</div>
              ) : (
                <div className="space-y-4">
                  {tickets.map((ticket) => (
                    <div key={ticket.id} className="p-3 border rounded-lg bg-slate-50">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium text-sm truncate pr-2">{ticket.subject}</span>
                        <Badge variant={ticket.status === 'open' ? 'default' : 'secondary'} className="text-xs">
                          {ticket.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center text-xs text-slate-500">
                        <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                        {ticket.priority === 'high' || ticket.priority === 'urgent' ? (
                          <span className="text-amber-600 font-medium flex items-center">
                            <Star className="h-3 w-3 mr-1" />{i18n.t('auto_priority_1')}</span>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
