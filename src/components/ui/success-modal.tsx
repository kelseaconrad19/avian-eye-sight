import { useEffect } from "react";
import { CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  autoClose?: boolean;
  duration?: number;
}

export function SuccessModal({ 
  isOpen, 
  onClose, 
  title, 
  description, 
  autoClose = true, 
  duration = 3000 
}: SuccessModalProps) {
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, duration, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-green-50 border-2 border-green-500 shadow-2xl animate-scale-in">
        <div className="flex flex-col items-center text-center p-6 space-y-4">
          <div className="relative">
            <CheckCircle className="h-16 w-16 text-green-600 animate-scale-in" />
            <div className="absolute inset-0 h-16 w-16 rounded-full bg-green-600/20 animate-ping" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-green-900">{title}</h2>
            <p className="text-green-800 text-sm leading-relaxed">{description}</p>
          </div>
          
          <Button 
            onClick={onClose}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6"
          >
            Got it!
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-2 right-2 text-green-600 hover:text-green-800 hover:bg-green-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}