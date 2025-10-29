import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, MessageCircle, X } from 'lucide-react';

const ContactUs = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
            Contact Us
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-4">
          {/* Email Contact */}
          <Card className="border-2 border-purple-100 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Mail className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">Email Us</h3>
                  <p className="text-sm text-gray-600">For general questions or inquiries</p>
                  <a 
                    href="mailto:support@swipescout.xyz" 
                    className="inline-block text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200 hover:underline"
                  >
                    support@swipescout.xyz
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Discord Contact */}
          <Card className="border-2 border-cyan-100 hover:border-cyan-300 transition-all duration-300 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-[#5865F2] to-[#4752C4] flex items-center justify-center shadow-lg">
                  <MessageCircle className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-semibold text-gray-900">Join Our Discord</h3>
                  <p className="text-sm text-gray-600">Connect with us and the community</p>
                  <a 
                    href="https://discord.gg/mHcdMn6yMh" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#5865F2] hover:bg-[#4752C4] text-white font-medium rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Join Discord Server
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-cyan-50 rounded-lg border border-purple-100">
            <p className="text-sm text-gray-600 text-center">
              We typically respond within <span className="font-semibold text-purple-600">24 hours</span> during business days
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactUs;
