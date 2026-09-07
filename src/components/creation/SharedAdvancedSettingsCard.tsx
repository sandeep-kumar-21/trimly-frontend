'use client';

import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, Clock, GitFork, Code2, Plus, Trash2, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { ToggleSwitch } from '@/components/ui/ToggleSwitch';

export interface RoutingRule {
  id: string;
  condition: 'Country' | 'Platform' | 'Device' | 'Region';
  operator: 'is' | 'is not';
  value: string;
  destinationUrl: string;
  isCollapsed?: boolean;
}

const ALL_COUNTRIES = [
  'Afghanistan',
  'Åland Islands',
  'Albania',
  'Algeria',
  'American Samoa',
  'Andorra',
  'Angola',
  'Anguilla',
  'Antarctica',
  'Antigua and Barbuda',
  'Argentina',
  'Armenia',
  'Aruba',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahamas',
  'Bahrain',
  'Bangladesh',
  'Barbados',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bermuda',
  'Bhutan',
  'Bolivia',
  'Bonaire, Sint Eustatius and Saba',
  'Bosnia and Herzegovina',
  'Botswana',
  'Brazil',
  'Brunei Darussalam',
  'Bulgaria',
  'Burkina Faso',
  'Burundi',
  'Cabo Verde',
  'Cambodia',
  'Cameroon',
  'Canada',
  'Cayman Islands',
  'Central African Republic',
  'Chad',
  'Chile',
  'China',
  'Colombia',
  'Comoros',
  'Congo',
  'Costa Rica',
  "Côte d'Ivoire",
  'Croatia',
  'Cuba',
  'Curaçao',
  'Cyprus',
  'Czechia',
  'Denmark',
  'Djibouti',
  'Dominica',
  'Dominican Republic',
  'Ecuador',
  'Egypt',
  'El Salvador',
  'Equatorial Guinea',
  'Eritrea',
  'Estonia',
  'Eswatini',
  'Ethiopia',
  'Fiji',
  'Finland',
  'France',
  'French Guiana',
  'French Polynesia',
  'Gabon',
  'Gambia',
  'Georgia',
  'Germany',
  'Ghana',
  'Gibraltar',
  'Greece',
  'Greenland',
  'Grenada',
  'Guadeloupe',
  'Guam',
  'Guatemala',
  'Guernsey',
  'Guinea',
  'Guinea-Bissau',
  'Guyana',
  'Haiti',
  'Holy See',
  'Honduras',
  'Hong Kong',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran',
  'Iraq',
  'Ireland',
  'Isle of Man',
  'Israel',
  'Italy',
  'Jamaica',
  'Japan',
  'Jersey',
  'Jordan',
  'Kazakhstan',
  'Kenya',
  'Kiribati',
  'Kuwait',
  'Kyrgyzstan',
  'Laos',
  'Latvia',
  'Lebanon',
  'Lesotho',
  'Liberia',
  'Libya',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Macao',
  'Madagascar',
  'Malawi',
  'Malaysia',
  'Maldives',
  'Mali',
  'Malta',
  'Marshall Islands',
  'Martinique',
  'Mauritania',
  'Mauritius',
  'Mexico',
  'Micronesia',
  'Moldova',
  'Monaco',
  'Mongolia',
  'Montenegro',
  'Montserrat',
  'Morocco',
  'Mozambique',
  'Myanmar',
  'Namibia',
  'Nauru',
  'Nepal',
  'Netherlands',
  'New Caledonia',
  'New Zealand',
  'Nicaragua',
  'Niger',
  'Nigeria',
  'North Macedonia',
  'Norway',
  'Oman',
  'Pakistan',
  'Palau',
  'Palestine',
  'Panama',
  'Papua New Guinea',
  'Paraguay',
  'Peru',
  'Philippines',
  'Poland',
  'Portugal',
  'Puerto Rico',
  'Qatar',
  'Réunion',
  'Romania',
  'Russia',
  'Rwanda',
  'Saint Kitts and Nevis',
  'Saint Lucia',
  'Saint Vincent and the Grenadines',
  'Samoa',
  'San Marino',
  'Saudi Arabia',
  'Senegal',
  'Serbia',
  'Seychelles',
  'Sierra Leone',
  'Singapore',
  'Sint Maarten',
  'Slovakia',
  'Slovenia',
  'Solomon Islands',
  'Somalia',
  'South Africa',
  'South Korea',
  'South Sudan',
  'Spain',
  'Sri Lanka',
  'Sudan',
  'Suriname',
  'Sweden',
  'Switzerland',
  'Syria',
  'Taiwan',
  'Tajikistan',
  'Tanzania',
  'Thailand',
  'Timor-Leste',
  'Togo',
  'Tonga',
  'Trinidad and Tobago',
  'Tunisia',
  'Turkey',
  'Turkmenistan',
  'Tuvalu',
  'Uganda',
  'Ukraine',
  'United Arab Emirates',
  'United Kingdom',
  'United States',
  'Uruguay',
  'Uzbekistan',
  'Vanuatu',
  'Venezuela',
  'Vietnam',
  'Yemen',
  'Zambia',
  'Zimbabwe',
];

const PLATFORMS = ['iOS', 'Android', 'Windows', 'macOS', 'Linux'];

export interface SharedAdvancedSettingsCardProps {
  type?: 'link' | 'qrcode';
  isDynamicRoutingActive?: boolean;
  onDynamicRoutingToggle?: (active: boolean) => void;
  defaultDestinationUrl?: string;
}

export const SharedAdvancedSettingsCard: React.FC<SharedAdvancedSettingsCardProps> = ({
  type = 'link',
  isDynamicRoutingActive = false,
  onDynamicRoutingToggle,
  defaultDestinationUrl = 'https://example.com/my-long-url',
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [utmEnabled, setUtmEnabled] = useState(false);
  const [expirationEnabled, setExpirationEnabled] = useState(false);
  const [dynamicRoutingEnabled, setDynamicRoutingEnabled] = useState(isDynamicRoutingActive);

  // Keep internal state synced if parent changes isDynamicRoutingActive (e.g. from "Set it up" click)
  useEffect(() => {
    if (isDynamicRoutingActive !== dynamicRoutingEnabled) {
      setDynamicRoutingEnabled(isDynamicRoutingActive);
    }
  }, [isDynamicRoutingActive]);

  const handleToggleDynamicRouting = (val: boolean) => {
    setDynamicRoutingEnabled(val);
    if (onDynamicRoutingToggle) {
      onDynamicRoutingToggle(val);
    }
  };

  // Dynamic Routing Rules State
  const [rules, setRules] = useState<RoutingRule[]>([
    {
      id: 'rule-1',
      condition: 'Country',
      operator: 'is',
      value: 'United States',
      destinationUrl: '',
      isCollapsed: false,
    },
  ]);

  const handleAddRule = () => {
    setRules((prev) => [
      ...prev,
      {
        id: `rule-${Date.now()}`,
        condition: 'Country',
        operator: 'is',
        value: 'United States',
        destinationUrl: '',
        isCollapsed: false,
      },
    ]);
  };

  const handleToggleCollapseRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isCollapsed: !r.isCollapsed } : r))
    );
  };

  const handleRemoveRule = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  const handleRuleChange = (id: string, field: keyof RoutingRule, val: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: val } : r))
    );
  };

  const isLinkMode = type === 'link';
  const isSaveRoutingValid =
    rules.length > 0 &&
    rules.every((r) => r.destinationUrl.trim().length > 0 && r.value.trim().length > 0);

  return (
    <section
      id="advanced-settings-card"
      className="rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs dark:border-slate-800 dark:bg-slate-900 space-y-5 transition-all"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
        <h2 className="text-lg font-bold text-[#273144] dark:text-slate-100">
          Advanced settings
        </h2>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Collapse Advanced settings section"
          className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
        >
          {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
      </div>

      {isOpen && (
        <div className="space-y-5">
          {/* Row 1: UTM Parameters */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Code2 className="h-5 w-5 text-slate-500 shrink-0" />
              <span className="text-sm font-bold text-[#273144] dark:text-slate-200">
                UTM parameters
              </span>
            </div>

            <ToggleSwitch
              checked={utmEnabled}
              onChange={setUtmEnabled}
              aria-label="Toggle UTM parameters"
            />
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Row 2: Link / Code Expiration */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Clock className="h-5 w-5 text-slate-500 shrink-0" />
              <span className="text-sm font-bold text-[#273144] dark:text-slate-200">
                {isLinkMode ? 'Link expiration' : 'Code expiration'}
              </span>
            </div>

            <ToggleSwitch
              checked={expirationEnabled}
              onChange={setExpirationEnabled}
              aria-label="Toggle expiration"
            />
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Row 3: Dynamic Routing */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <GitFork className="h-5 w-5 text-slate-500 shrink-0" />
                <span className="text-sm font-bold text-[#273144] dark:text-slate-200">
                  Dynamic routing
                </span>
              </div>

              <ToggleSwitch
                checked={dynamicRoutingEnabled}
                onChange={handleToggleDynamicRouting}
                aria-label="Toggle dynamic routing"
              />
            </div>

            <p className="text-xs text-[#526281] leading-relaxed dark:text-slate-400">
              Direct visitors to different destination URLs based on conditions such as device or location. Rules apply in order, and traffic is routed based on the first condition matched. All other traffic is routed to the default destination.{' '}
              <a href="#learn" className="text-[#2a5bd7] underline font-semibold">
                Learn more
              </a>
              .
            </p>

            {/* BITLY EXACT MATCH: EXPANDED DYNAMIC ROUTING RULES AREA */}
            {dynamicRoutingEnabled && (
              <div className="mt-6 pt-4 space-y-6 animate-in fade-in duration-200">
                {/* 1. Header Row: ROUTING RULES */}
                <div className="flex items-center gap-3">
                  <h3 className="text-xs font-bold tracking-wider uppercase text-[#273144] dark:text-slate-200">
                    ROUTING RULES
                  </h3>
                  <hr className="flex-1 border-slate-200/80 dark:border-slate-800" />
                </div>

                {/* 2. Rules List */}
                <div className="space-y-4">
                  {rules.map((rule, idx) => (
                    <div
                      key={rule.id}
                      className="rounded-xl border border-slate-200/90 bg-white p-5 space-y-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900"
                    >
                      {/* Rule Card Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-5 w-5 text-slate-400 cursor-grab" />
                          <span className="text-sm font-bold text-[#273144] dark:text-slate-100">
                            Rule {idx + 1}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {rules.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveRule(rule.id)}
                              className="text-slate-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                              aria-label="Remove rule"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleToggleCollapseRule(rule.id)}
                            className="flex items-center gap-1 text-xs font-bold text-[#273144] hover:bg-slate-100 px-2 py-1 rounded-md transition-colors cursor-pointer dark:text-slate-200 dark:hover:bg-slate-800"
                          >
                            {rule.isCollapsed ? (
                              <>
                                <ChevronDown className="h-4 w-4" />
                                <span>Expand</span>
                              </>
                            ) : (
                              <>
                                <ChevronUp className="h-4 w-4" />
                                <span>Collapse</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {!rule.isCollapsed && (
                        <div className="space-y-4 pt-1">
                          {/* "If" Section */}
                          <div className="space-y-2">
                            <label className="block text-sm font-bold text-[#273144] dark:text-slate-200">
                              If
                            </label>

                            {/* Controls Row matching Bitly screenshots 1, 2, 3 */}
                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                              {/* Condition Dropdown (Country, Platform, Device, Region) */}
                              <div className="sm:col-span-4">
                                <CustomSelect
                                  value={rule.condition}
                                  onChange={(val) =>
                                    handleRuleChange(rule.id, 'condition', val as any)
                                  }
                                  options={['Country', 'Region', 'Device', 'Platform']}
                                />
                              </div>

                              {/* Operator Dropdown (is, is not) */}
                              <div className="sm:col-span-3">
                                <CustomSelect
                                  value={rule.operator}
                                  onChange={(val) =>
                                    handleRuleChange(rule.id, 'operator', val as any)
                                  }
                                  options={['is', 'is not']}
                                />
                              </div>

                              {/* Values Selector with 240+ Countries or Platforms */}
                              <div className="sm:col-span-5">
                                <CustomSelect
                                  value={rule.value}
                                  onChange={(val) =>
                                    handleRuleChange(rule.id, 'value', val)
                                  }
                                  options={rule.condition === 'Country' ? ALL_COUNTRIES : PLATFORMS}
                                  placeholder="Select values..."
                                />
                              </div>
                            </div>

                            {/* + Add condition link under condition controls */}
                            <div className="flex justify-end pt-1">
                              <button
                                type="button"
                                onClick={() =>
                                  alert('Multiple conditions added to Rule')
                                }
                                className="inline-flex items-center gap-1 text-xs font-bold text-[#2a5bd7] hover:underline cursor-pointer"
                              >
                                <Plus className="h-3.5 w-3.5" />
                                <span>Add condition</span>
                              </button>
                            </div>
                          </div>

                          {/* "Then go to" Section */}
                          <div className="space-y-1.5 pt-1 border-t border-slate-100 dark:border-slate-800">
                            <label className="block text-sm font-bold text-[#273144] dark:text-slate-200">
                              Then go to
                            </label>
                            <input
                              type="text"
                              value={rule.destinationUrl}
                              onChange={(e) =>
                                handleRuleChange(rule.id, 'destinationUrl', e.target.value)
                              }
                              placeholder="https://example.com/target-location-url"
                              className="w-full h-11 rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-900 shadow-2xs focus:border-[#2a5bd7] focus:outline-hidden dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* 3. + Add Rule Button matching Bitly exact screenshot 1 */}
                <div>
                  <button
                    type="button"
                    onClick={handleAddRule}
                    className="h-10 px-4 rounded-lg border border-slate-200 bg-[#f4f6f8] text-sm font-bold text-[#273144] hover:bg-slate-200/70 transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200"
                  >
                    <Plus className="h-4 w-4 text-slate-500" />
                    <span>Add rule</span>
                  </button>
                </div>

                {/* 4. Default Destination Container (Dashed Border Card) matching Bitly exact screenshot 1 */}
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 p-5 space-y-2 dark:border-slate-800 dark:bg-slate-900/50">
                  <label htmlFor="default-destination" className="block text-sm font-bold text-[#273144] dark:text-slate-200">
                    Default destination (used when no routing conditions are met)
                  </label>
                  <input
                    id="default-destination"
                    type="text"
                    disabled
                    readOnly
                    value={defaultDestinationUrl}
                    className="w-full h-11 rounded-lg border border-slate-200 bg-slate-100/80 px-4 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-400 font-medium cursor-not-allowed"
                  />
                </div>

                {/* 5. Save & Cancel Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => handleToggleDynamicRouting(false)}
                    className="h-10 px-5 rounded-md border border-slate-300 bg-white text-sm font-bold text-[#273144] hover:bg-slate-50 transition-colors cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={!isSaveRoutingValid}
                    onClick={() =>
                      alert('Dynamic routing rules saved successfully!')
                    }
                    className="h-10 px-5 rounded-md bg-[#2a5bd7] text-white text-sm font-bold hover:bg-[#1a4bb7] transition-colors shadow-2xs cursor-pointer disabled:bg-[#a6c1f7] disabled:opacity-70 disabled:cursor-not-allowed dark:disabled:bg-slate-800 dark:disabled:text-slate-500"
                  >
                    Save dynamic routing
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
