# Property Info Extraction Tool

A Next.js application that automates the extraction of property information from PDF brochures using AI, streamlining the process of uploading property data to external platforms.

## Overview

This tool simplifies the workflow of extracting structured property information from PDF brochures by:

* Uploading property brochure PDFs
* Selecting specific pages to process (with page exclusion options)
* Using AI to extract basic property details
* Extracting detailed sub-information through additional AI processing
* Uploading the extracted data to the backend system

## Features

* **PDF Upload** : Easy drag-and-drop or file selection for property brochures
* **Page Selection** : Choose which pages to include or exclude from processing
* **AI-Powered Extraction** : Two-stage AI extraction process
* Stage 1: Extract basic property details
* Stage 2: Extract comprehensive sub-details
* **Backend Integration** : Seamless API integration to upload extracted data
* **Next.js Framework** : Built with modern React and Next.js for optimal performance

## How It Works

1. **Upload PDF** : Upload a property brochure PDF file
2. **Select Pages** : Review and exclude any irrelevant pages from the document
3. **Basic Extraction** : AI processes the selected pages to extract core property information
4. **Detailed Extraction** : AI performs a second pass to extract comprehensive sub-details
5. **Data Upload** : Extracted information is automatically sent to your backend API

## Technology Stack

* **Framework** : Next.js
* **AI Processing** : Integrated AI service for document analysis
* **File Handling** : PDF processing capabilities
* **API Integration** : Backend connectivity for data upload

## Getting Started

### Prerequisites

* Node.js (v16 or higher)
* npm or yarn package manager
* Backend API credentials

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd property-info-extraction-tool

# Install dependencies
npm install
# or
yarn install
```

### Configuration

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_API_URL=<your-backend-api-url>
AI_SERVICE_API_KEY=<your-ai-service-key>
```

### Running the Application

```bash
# Development mode
npm run dev
# or
yarn dev

# Production build
npm run build
npm start
```

The application will be available at `http://localhost:3000`

## Usage

1. Navigate to the application in your web browser
2. Click on the upload area or drag a PDF brochure into the designated zone
3. Review the PDF pages and deselect any pages you want to exclude
4. Click "Extract Basic Details" to begin the first AI extraction
5. Review the basic details and click "Extract Sub-Details" for comprehensive extraction
6. Verify the extracted information
7. Click "Upload to Backend" to send the data to your system

## API Integration

The tool integrates with your backend API to upload extracted property data. Ensure your backend endpoint accepts the following data structure:

```json
{
  "basicDetails": {
    // Basic property information
  },
  "subDetails": {
    // Detailed property information
  }
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues or questions, please open an issue in the repository or contact [your-contact-info].
