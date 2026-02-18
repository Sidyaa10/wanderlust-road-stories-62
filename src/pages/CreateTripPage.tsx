import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X } from 'lucide-react';
import { api, RoadTrip, RoadStop } from '@/services/api';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const CreateTripPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    distance: '',
    duration: '',
    difficulty: 'Moderate',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&auto=format&fit=crop',
  });
  
  const [stops, setStops] = useState<Partial<RoadStop>[]>([
    { 
      name: '', 
      description: '', 
      location: '',
      image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&auto=format&fit=crop',
      position: 1
    }
  ]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleStopChange = (index: number, field: string, value: string) => {
    const updatedStops = [...stops];
    updatedStops[index] = { ...updatedStops[index], [field]: value };
    setStops(updatedStops);
  };
  
  const addStop = () => {
    setStops(prev => [
      ...prev, 
      { 
        name: '', 
        description: '', 
        location: '',
        image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&auto=format&fit=crop',
        position: prev.length + 1
      }
    ]);
  };
  
  const removeStop = (index: number) => {
    if (stops.length <= 1) return;
    
    const updatedStops = [...stops];
    updatedStops.splice(index, 1);
    
    // Update positions
    updatedStops.forEach((stop, i) => {
      stop.position = i + 1;
    });
    
    setStops(updatedStops);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.description || !formData.location || !formData.distance || !formData.duration) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Validate stops
    for (const stop of stops) {
      if (!stop.name || !stop.description || !stop.location) {
        toast({
          title: "Incomplete Stops",
          description: "Please fill in all information for each stop.",
          variant: "destructive",
        });
        return;
      }
    }
    
    try {
      setIsSubmitting(true);
      
      console.log('Stops in form:', stops); // Debug log
      const newTrip = await api.createTrip({
        title: formData.title,
        description: formData.description,
        location: formData.location,
        distance: Number(formData.distance),
        duration: Number(formData.duration),
        difficulty: formData.difficulty as RoadTrip['difficulty'],
        image: formData.image,
        stops: stops as RoadStop[],
      });
      
      toast({
        title: "Trip Created!",
        description: "Your road trip has been successfully shared.",
      });
      
      // Navigate to the trip detail page
      navigate(`/trip/${newTrip.id}`);
    } catch (error) {
      console.error('Error creating trip:', error);
      toast({
        title: "Error",
        description: "Failed to create your trip. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="bg-forest-700 py-16">
        <div className="container max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white mb-6">Share Your Road Trip</h1>
          <p className="text-lg text-white/90 mb-8 max-w-3xl">
            Share your road trip experience with the community.
            Add all the details, stops, and tips to help others plan their journey.
          </p>
        </div>
      </div>
      
      <div className="container max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">Trip Details</h2>
            
            <div className="space-y-6">
              <div>
                <Label htmlFor="title" className="block mb-2">Trip Title <span className="text-red-500">*</span></Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Pacific Coast Highway Adventure"
                  className="w-full"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description" className="block mb-2">Description <span className="text-red-500">*</span></Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe this road trip, including what makes it special and what travelers should expect..."
                  rows={5}
                  className="w-full"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="location" className="block mb-2">Location <span className="text-red-500">*</span></Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., California, USA"
                    className="w-full"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="difficulty" className="block mb-2">Difficulty <span className="text-red-500">*</span></Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(value) => handleSelectChange('difficulty', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Moderate">Moderate</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="distance" className="block mb-2">Distance (km) <span className="text-red-500">*</span></Label>
                  <Input
                    id="distance"
                    name="distance"
                    type="number"
                    min="1"
                    value={formData.distance}
                    onChange={handleInputChange}
                    placeholder="e.g., 500"
                    className="w-full"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="duration" className="block mb-2">Duration (days) <span className="text-red-500">*</span></Label>
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    min="1"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="e.g., 5"
                    className="w-full"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Label htmlFor="image" className="block mb-2">Cover Image URL</Label>
                  <Input
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Trip Stops</h2>
              <Button 
                type="button" 
                onClick={addStop}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Stop
              </Button>
            </div>
            
            <div className="space-y-8">
              {stops.map((stop, index) => (
                <Card key={index} className="relative">
                  <Button
                    type="button"
                    onClick={() => removeStop(index)}
                    variant="ghost"
                    size="sm"
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                    disabled={stops.length <= 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  
                  <CardContent className="pt-6">
                    <div className="flex items-center mb-4">
                      <div className="w-8 h-8 rounded-full bg-forest-100 text-forest-700 flex items-center justify-center font-bold text-sm mr-3">
                        {index + 1}
                      </div>
                      <h3 className="text-lg font-semibold">Stop {index + 1}</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor={`stop-name-${index}`} className="block mb-2">Stop Name <span className="text-red-500">*</span></Label>
                        <Input
                          id={`stop-name-${index}`}
                          value={stop.name}
                          onChange={(e) => handleStopChange(index, 'name', e.target.value)}
                          placeholder="e.g., Golden Gate Bridge"
                          className="w-full"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`stop-location-${index}`} className="block mb-2">Location <span className="text-red-500">*</span></Label>
                        <Input
                          id={`stop-location-${index}`}
                          value={stop.location}
                          onChange={(e) => handleStopChange(index, 'location', e.target.value)}
                          placeholder="e.g., San Francisco, CA"
                          className="w-full"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`stop-description-${index}`} className="block mb-2">Description <span className="text-red-500">*</span></Label>
                        <Textarea
                          id={`stop-description-${index}`}
                          value={stop.description}
                          onChange={(e) => handleStopChange(index, 'description', e.target.value)}
                          placeholder="Describe what's special about this stop..."
                          rows={3}
                          className="w-full"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`stop-image-${index}`} className="block mb-2">Image URL</Label>
                        <Input
                          id={`stop-image-${index}`}
                          value={stop.image}
                          onChange={(e) => handleStopChange(index, 'image', e.target.value)}
                          placeholder="https://example.com/image.jpg"
                          className="w-full"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/explore')}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-forest-700 hover:bg-forest-800 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Trip'}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CreateTripPage;
