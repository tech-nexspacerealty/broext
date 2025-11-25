'use client'
import { useState } from 'react';
import { FileText, Zap, Upload, Database, ArrowRight, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function WelcomePage() {
  const [isStarting, setIsStarting] = useState(false);

  const nav = useRouter();

  const handleGetStarted = () => {
    setIsStarting(true);
    setTimeout(() => {
        nav.push("/extract");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Property Info Extractor</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-extrabold text-white mb-6">
            Extract Property Information
            <span className="block text-blue-500 mt-2">in Seconds</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Upload property brochures and let AI automatically extract all the details you need. 
            Save hours of manual data entry with our intelligent extraction tool.
          </p>
          <button
            onClick={handleGetStarted}
            disabled={isStarting}
            className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-lg shadow-lg hover:shadow-blue-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isStarting ? 'Starting...' : 'Get Started'}
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/20">
            <div className="bg-blue-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Upload className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Upload PDF</h3>
            <p className="text-gray-400">
              Simply upload your property brochure in PDF format
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-green-500 transition-all hover:shadow-lg hover:shadow-green-500/20">
            <div className="bg-green-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Select Pages</h3>
            <p className="text-gray-400">
              Choose which pages to include or exclude from extraction
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-purple-500 transition-all hover:shadow-lg hover:shadow-purple-500/20">
            <div className="bg-purple-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">AI Extraction</h3>
            <p className="text-gray-400">
              Let AI automatically extract property details in two stages
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-orange-500 transition-all hover:shadow-lg hover:shadow-orange-500/20">
            <div className="bg-orange-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Database className="w-6 h-6 text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Auto Upload</h3>
            <p className="text-gray-400">
              Data is automatically uploaded to your backend system
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-8 md:p-12">
          <h3 className="text-3xl font-bold text-white mb-8 text-center">
            How It Works
          </h3>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-semibold">
                1
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-1">Upload Your PDF</h4>
                <p className="text-gray-400">
                  Drag and drop or select your property brochure PDF file
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-semibold">
                2
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-1">Review and Select Pages</h4>
                <p className="text-gray-400">
                  Preview all pages and exclude any irrelevant content
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-semibold">
                3
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-1">AI Extracts Basic Details</h4>
                <p className="text-gray-400">
                  First AI pass captures core property information
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-semibold">
                4
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-1">Extract Detailed Information</h4>
                <p className="text-gray-400">
                  Second AI pass captures comprehensive sub-details
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-semibold">
                5
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-1">Automatic Upload</h4>
                <p className="text-gray-400">
                  Extracted data is sent to your backend system automatically
                </p>
              </div>
            </div>
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={handleGetStarted}
              disabled={isStarting}
              className="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-blue-500/50 transition-all duration-200 disabled:opacity-50"
            >
              Start Extracting Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">Save Time</h4>
            <p className="text-gray-400">
              Reduce manual data entry from hours to minutes
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">Increase Accuracy</h4>
            <p className="text-gray-400">
              AI-powered extraction reduces human error
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">Streamline Workflow</h4>
            <p className="text-gray-400">
              Seamless integration with your existing systems
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-400">
            © 2024 Property Info Extractor. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}