import React, { useState, FormEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, MessageSquare, Phone, User, Send } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { toast } from "@/hooks/use-toast";

const FeedBackPage: React.FC = () => {
  const { theme } = useTheme();
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!name || !phone || rating === 0 || !feedback) {
      toast({
        title: "Missing Information",
        description: "Please fill out all fields before submitting.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Try Supabase first, fallback to localStorage
      let success = false;
      
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/feedback-submit`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify({ name, phone, rating, feedback }),
          }
        );

        if (response.ok) {
          const result = await response.json();
          if (!result.error) {
            success = true;
          }
        }
      } catch (supabaseError) {
        console.log('Supabase unavailable, using local storage');
      }

      // Fallback to localStorage if Supabase fails
      if (!success) {
        const feedbackData = {
          id: Date.now(),
          name,
          phone,
          rating,
          feedback,
          created_at: new Date().toISOString()
        };
        
        const existingFeedback = JSON.parse(localStorage.getItem('feedbackSubmissions') || '[]');
        existingFeedback.push(feedbackData);
        localStorage.setItem('feedbackSubmissions', JSON.stringify(existingFeedback));
      }
      
      setSubmitted(true);
      toast({
        title: "Feedback Submitted!",
        description: "Thank you for your valuable feedback.",
      });

      // Clear form
      setName("");
      setPhone("");
      setRating(0);
      setFeedback("");
    } catch (err) {
      console.error("Error submitting feedback:", err);
      toast({
        title: "Submission Failed",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStarClick = (star: number) => {
    setRating(star);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-foreground'}`}>
          💬 Feedback
        </h1>
        <p className={theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'}>
          Share your experience and help us improve
        </p>
      </div>

      <Card className={`max-w-2xl mx-auto ${theme === 'dark' ? 'bg-gray-800 border-gray-600' : ''}`}>
        <CardHeader>
          <CardTitle className={`flex items-center ${theme === 'dark' ? 'text-white' : ''}`}>
            <MessageSquare className="mr-2 h-5 w-5" />
            Your Feedback Matters
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {submitted && (
            <div className={`p-4 rounded-lg mb-6 ${theme === 'dark' ? 'bg-green-900 text-green-200' : 'bg-green-50 text-green-800'}`}>
              <p className="font-medium">Thank you for your feedback!</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <Label htmlFor="name" className={`flex items-center ${theme === 'dark' ? 'text-gray-300' : ''}`}>
                <User className="mr-2 h-4 w-4" />
                Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`mt-2 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
              />
            </div>

            {/* Phone Field */}
            <div>
              <Label htmlFor="phone" className={`flex items-center ${theme === 'dark' ? 'text-gray-300' : ''}`}>
                <Phone className="mr-2 h-4 w-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Your Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`mt-2 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
              />
            </div>

            {/* Rating */}
            <div>
              <Label className={`flex items-center ${theme === 'dark' ? 'text-gray-300' : ''}`}>
                <Star className="mr-2 h-4 w-4" />
                Rating
              </Label>
              <div className="flex items-center mt-2 space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleStarClick(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-8 w-8 transition-colors ${
                        star <= rating 
                          ? 'text-yellow-400 fill-yellow-400' 
                          : theme === 'dark' ? 'text-gray-600' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                {rating > 0 && (
                  <span className={`ml-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    {rating} out of 5 stars
                  </span>
                )}
              </div>
            </div>

            {/* Feedback Description */}
            <div>
              <Label htmlFor="feedback" className={`flex items-center ${theme === 'dark' ? 'text-gray-300' : ''}`}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Feedback Description
              </Label>
              <Textarea
                id="feedback"
                placeholder="Write your feedback here..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
                className={`mt-2 ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
              />
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Feedback
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedBackPage;