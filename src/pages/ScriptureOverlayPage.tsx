import React, { useState } from 'react';
import { PageContainer } from '@/components/layout/PageContainer';
import { PhotoSelector } from '@/components/scripture/PhotoSelector';
import { VerseSelector } from '@/components/scripture/VerseSelector';
import { OverlayEditor } from '@/components/scripture/OverlayEditor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Image } from 'lucide-react';
import { BibleVerse, PhotoItem, OverlaySettings } from '@/types/scripture';
import { useIsMobile } from '@/hooks/use-mobile';

export const ScriptureOverlayPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'photo' | 'verse' | 'editor'>('photo');
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [selectedVerse, setSelectedVerse] = useState<BibleVerse | null>(null);
  const [customVerse, setCustomVerse] = useState<string>('');
  const isMobile = useIsMobile();

  // Add haptic feedback for mobile
  const triggerHapticFeedback = () => {
    if (isMobile && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }
  };

  const handlePhotoSelected = (photo: PhotoItem) => {
    setSelectedPhoto(photo);
    setCurrentStep('verse');
  };

  const handleVerseSelected = (verse: BibleVerse | null, custom?: string) => {
    setSelectedVerse(verse);
    setCustomVerse(custom || '');
    setCurrentStep('editor');
  };

  const handleBack = () => {
    triggerHapticFeedback();
    if (currentStep === 'verse') {
      setCurrentStep('photo');
      setSelectedPhoto(null);
    } else if (currentStep === 'editor') {
      setCurrentStep('verse');
      setSelectedVerse(null);
      setCustomVerse('');
    }
  };

  const handleStartOver = () => {
    triggerHapticFeedback();
    setCurrentStep('photo');
    setSelectedPhoto(null);
    setSelectedVerse(null);
    setCustomVerse('');
  };

  return (
    <PageContainer title="Scripture Overlay">
      <div className={`${isMobile ? 'w-full' : 'max-w-6xl'} mx-auto space-y-4 ${isMobile ? 'px-2' : ''}`}>
        {/* Progress Header */}
        <Card>
          <CardHeader className={isMobile ? 'pb-3' : ''}>
            <div className="flex items-center justify-between">
              <CardTitle className={`flex items-center gap-2 ${isMobile ? 'text-lg' : ''}`}>
                <BookOpen className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-primary`} />
                Create Scripture Overlay
              </CardTitle>
              {currentStep !== 'photo' && (
                <Button 
                  variant="outline" 
                  onClick={handleBack}
                  size={isMobile ? "sm" : "default"}
                  className={isMobile ? 'h-8 px-3' : ''}
                >
                  <ArrowLeft className={`${isMobile ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-2'}`} />
                  Back
                </Button>
              )}
            </div>
            
            {/* Progress Steps - Mobile optimized */}
            <div className={`flex items-center ${isMobile ? 'space-x-2 mt-3' : 'space-x-4 mt-4'}`}>
              <div className={`flex items-center ${isMobile ? 'space-x-1' : 'space-x-2'} ${
                currentStep === 'photo' ? 'text-primary' : 
                selectedPhoto ? 'text-green-600' : 'text-muted-foreground'
              }`}>
                <div className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} rounded-full flex items-center justify-center ${
                  currentStep === 'photo' ? 'bg-primary text-primary-foreground' :
                  selectedPhoto ? 'bg-green-600 text-white' : 'bg-muted'
                }`}>
                  <Image className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                </div>
                <span className={`font-medium ${isMobile ? 'text-xs' : ''}`}>
                  {isMobile ? 'Photo' : 'Select Photo'}
                </span>
              </div>
              
              <div className={`${isMobile ? 'w-4 h-px' : 'w-8 h-px'} bg-border`}></div>
              
              <div className={`flex items-center ${isMobile ? 'space-x-1' : 'space-x-2'} ${
                currentStep === 'verse' ? 'text-primary' : 
                selectedVerse || customVerse ? 'text-green-600' : 'text-muted-foreground'
              }`}>
                <div className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} rounded-full flex items-center justify-center ${
                  currentStep === 'verse' ? 'bg-primary text-primary-foreground' :
                  selectedVerse || customVerse ? 'bg-green-600 text-white' : 'bg-muted'
                }`}>
                  <BookOpen className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                </div>
                <span className={`font-medium ${isMobile ? 'text-xs' : ''}`}>
                  {isMobile ? 'Verse' : 'Choose Verse'}
                </span>
              </div>
              
              <div className={`${isMobile ? 'w-4 h-px' : 'w-8 h-px'} bg-border`}></div>
              
              <div className={`flex items-center ${isMobile ? 'space-x-1' : 'space-x-2'} ${
                currentStep === 'editor' ? 'text-primary' : 'text-muted-foreground'
              }`}>
                <div className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} rounded-full flex items-center justify-center ${
                  currentStep === 'editor' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}>
                  <span className={isMobile ? 'text-xs' : ''}>✨</span>
                </div>
                <span className={`font-medium ${isMobile ? 'text-xs' : ''}`}>
                  {isMobile ? 'Create' : 'Create Overlay'}
                </span>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Step Content */}
        {currentStep === 'photo' && (
          <PhotoSelector onPhotoSelected={handlePhotoSelected} />
        )}

        {currentStep === 'verse' && (
          <VerseSelector 
            onVerseSelected={handleVerseSelected}
            selectedVerse={selectedVerse}
            customVerse={customVerse}
          />
        )}

        {currentStep === 'editor' && selectedPhoto && (
          <OverlayEditor
            photo={selectedPhoto}
            verse={selectedVerse}
            customVerse={customVerse}
            onStartOver={handleStartOver}
          />
        )}
      </div>
    </PageContainer>
  );
};