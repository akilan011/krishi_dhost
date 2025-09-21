import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MessageSquare, Phone, User, Calendar, Trash2 } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface FeedbackItem {
  id: number;
  name: string;
  phone: string;
  rating: number;
  feedback: string;
  created_at: string;
}

const FeedbackAdmin: React.FC = () => {
  const { theme } = useTheme();
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = () => {
    const stored = localStorage.getItem('feedbackSubmissions');
    if (stored) {
      setFeedbackList(JSON.parse(stored));
    }
  };

  const deleteFeedback = (id: number) => {
    const updated = feedbackList.filter(item => item.id !== id);
    setFeedbackList(updated);
    localStorage.setItem('feedbackSubmissions', JSON.stringify(updated));
  };

  const clearAllFeedback = () => {
    if (confirm('Are you sure you want to delete all feedback?')) {
      setFeedbackList([]);
      localStorage.removeItem('feedbackSubmissions');
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-foreground'}`}>
            📊 Feedback Admin
          </h1>
          <p className={theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'}>
            View and manage user feedback submissions
          </p>
        </div>
        {feedbackList.length > 0 && (
          <Button variant="destructive" onClick={clearAllFeedback}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      {feedbackList.length === 0 ? (
        <Card className={theme === 'dark' ? 'bg-gray-800 border-gray-600' : ''}>
          <CardContent className="text-center py-12">
            <MessageSquare className={`h-12 w-12 mx-auto mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
            <h3 className={`text-lg font-semibold mb-2 ${theme === 'dark' ? 'text-white' : ''}`}>
              No Feedback Yet
            </h3>
            <p className={theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'}>
              Feedback submissions will appear here when users submit them.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Badge variant="secondary" className="text-sm">
              Total Feedback: {feedbackList.length}
            </Badge>
          </div>

          {feedbackList.map((item) => (
            <Card key={item.id} className={theme === 'dark' ? 'bg-gray-800 border-gray-600' : ''}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${theme === 'dark' ? 'bg-blue-900' : 'bg-blue-100'}`}>
                      <User className={`h-4 w-4 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`} />
                    </div>
                    <div>
                      <CardTitle className={`text-lg ${theme === 'dark' ? 'text-white' : ''}`}>
                        {item.name}
                      </CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {item.phone}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(item.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteFeedback(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Rating */}
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Rating:
                    </span>
                    <div className="flex items-center space-x-1">
                      {renderStars(item.rating)}
                      <span className={`text-sm ml-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        ({item.rating}/5)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Feedback Text */}
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <MessageSquare className="h-4 w-4" />
                    <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      Feedback:
                    </span>
                  </div>
                  <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                      {item.feedback}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedbackAdmin;