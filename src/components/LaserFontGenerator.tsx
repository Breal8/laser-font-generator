import React, { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const LaserFontGenerator = () => {
  const [text, setText] = useState('LASER');
  const [svgContent, setSvgContent] = useState('');

  const generateLaserSVG = (inputText) => {
    const fontSize = 48;
    const lineHeight = fontSize * 1.2;
    const strokeWidth = 0.2;
    const padding = 20;
    const svgWidth = inputText.length * fontSize + 2 * padding;
    const svgHeight = lineHeight + 2 * padding;
    
    return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}" height="${svgHeight}">
  <style>
    text {
      font-family: monospace;
      font-size: ${fontSize}px;
      fill: none;
      stroke: black;
      stroke-width: ${strokeWidth};
      stroke-linecap: round;
    }
  </style>
  <text x="${padding}" y="${lineHeight}">${inputText}</text>
</svg>`;
  };

  const handleGenerateSVG = () => {
    const svg = generateLaserSVG(text);
    setSvgContent(svg);
  };

  const handleDownloadSVG = useCallback(() => {
    if (!svgContent) {
      alert('Generate an SVG first');
      return;
    }

    try {
      // Preferred method: Blob with automatic cleanup
      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'laser_etched_text.svg';
      
      // Append to body, click, and clean up in one operation
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Important: Revoke the object URL to free up memory
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('SVG Download Error:', error);
      
      // Fallback method: Data URI
      try {
        const dataUri = `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
        const link = document.createElement('a');
        link.href = dataUri;
        link.download = 'laser_etched_text.svg';
        link.click();
      } catch (fallbackError) {
        console.error('Fallback Download Method Failed:', fallbackError);
        prompt('Unable to download automatically. Copy SVG:', svgContent);
      }
    }
  }, [svgContent]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Laser Font Generator (200µm)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input 
            type="text" 
            value={text} 
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to laser etch"
            className="flex-grow"
          />
          <Button onClick={handleGenerateSVG}>Generate</Button>
        </div>
        
        {svgContent && (
          <div className="space-y-2">
            <div 
              className="border p-4 flex justify-center items-center"
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
            <Button 
              variant="secondary" 
              onClick={handleDownloadSVG}
              className="w-full"
            >
              Download SVG
            </Button>
          </div>
        )}
        
        {svgContent && (
          <div className="mt-4 bg-gray-100 p-2 rounded max-h-40 overflow-auto">
            <pre className="text-xs break-words whitespace-pre-wrap">{svgContent}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LaserFontGenerator;