import React, { useState } from 'react';
import { UserPreferences, UserRole, PreferenceScreenProps } from '../types';
import { Button } from './ui/Button';
import { MapPin, Sprout, Weight, Clock, ChevronDown, ArrowRight } from 'lucide-react';
import { PersonaManager } from './PersonaManager';

export const PreferenceScreen: React.FC<PreferenceScreenProps> = ({ 
  userRole, 
  initialPreferences, 
  onComplete, 
  onSwitchPersona, 
  onSkip 
}) => {
  const [formData, setFormData] = useState<UserPreferences>(initialPreferences || {
    location: '',
    primaryCrop: '',
    loadSize: '',
    urgency: 'Normal'
  });
  const [showPersonaManager, setShowPersonaManager] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Allow saving even if partially filled, or enforce rules? 
    // Prompt says "Login should only require persona selection", this screen is next.
    // Let's enforce basic validation if they choose to submit, but they can skip.
    if (formData.location && formData.primaryCrop) {
      onComplete(formData);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      <div className="absolute top-4 right-4 z-10">
        <button 
            onClick={() => setShowPersonaManager(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-800 rounded-lg text-xs font-bold uppercase transition-colors border border-gray-200"
        >
            {userRole.split(' ')[0]} <ChevronDown size={14} className="text-gray-500" />
        </button>
      </div>

      <div className="flex-1 max-w-lg mx-auto w-full flex flex-col justify-center p-6">
        <div className="flex justify-between items-start mb-8">
            <div>
                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wide mb-2">
                    {userRole}
                </span>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Setup Your Profile</h2>
                <p className="text-gray-500">Customize your Saarthi experience.</p>
            </div>
            <button 
              onClick={onSkip} 
              className="group flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-green-600 transition-colors py-2"
            >
              Skip for now <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Location (Mandi / City)</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Nashik, Pune"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  required
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Primary Crop</label>
              <div className="relative">
                <Sprout className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  name="primaryCrop"
                  value={formData.primaryCrop}
                  onChange={handleChange}
                  placeholder="e.g. Onion, Tomato"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  required
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Typical Load Size</label>
              <div className="relative">
                <Weight className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  name="loadSize"
                  value={formData.loadSize}
                  onChange={handleChange}
                  placeholder="e.g. 2 Tons"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Urgency</label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 text-gray-400" size={20} />
                <select
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white"
                >
                  <option value="Normal">Normal Delivery</option>
                  <option value="Urgent">Urgent (Perishable)</option>
                  <option value="Flexible">Flexible Schedule</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button type="submit" fullWidth>Save & Continue</Button>
          </div>
        </form>
      </div>

      <PersonaManager 
        isOpen={showPersonaManager}
        onClose={() => setShowPersonaManager(false)}
        currentRole={userRole}
        onSwitch={onSwitchPersona}
      />
    </div>
  );
};