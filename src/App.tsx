import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight, Minus, Plus, RotateCw, Download, Menu, Sun, Moon, Link } from "lucide-react";
import { Document, Page, pdfjs } from 'react-pdf';
import './App.css'
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PDFViewer() {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState("light");
  const [pdfSource, setPdfSource] = useState<File | string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [pdfUrl, setPdfUrl] = useState("");
  const mainContentRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (mainContentRef.current) {
      const scrollPosition = mainContentRef.current.scrollTop;
      const pageHeight = mainContentRef.current.scrollHeight / totalPages;
      const newPage = Math.floor(scrollPosition / pageHeight) + 1;
      setCurrentPage(newPage);
    }
  };

  useEffect(() => {
    const mainContent = mainContentRef.current;
    if (mainContent) {
      mainContent.addEventListener('scroll', handleScroll);
      return () => mainContent.removeEventListener('scroll', handleScroll);
    }
  }, [totalPages]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const scrollToPage = (page: number) => {
    if (mainContentRef.current) {
      const pageHeight = mainContentRef.current.scrollHeight / totalPages;
      mainContentRef.current.scrollTo({
        top: (page - 1) * pageHeight,
        behavior: 'smooth'
      });
    }
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPdfSource(file);
      setPdfUrl("");
    }
  };

  const handleUrlSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pdfUrl) {
      setPdfSource(pdfUrl);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setTotalPages(numPages);
  };

  const handleDownload = () => {
    if (typeof pdfSource === 'string') {
      window.open(pdfSource, '_blank');
    } else if (pdfSource instanceof File) {
      const url = URL.createObjectURL(pdfSource);
      const link = document.createElement('a');
      link.href = url;
      link.download = pdfSource.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleRotation = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const calculatePageDimensions = (width: number, height: number) => {
    let scaledWidth, scaledHeight;

    if (rotation % 180 === 0) {
      scaledWidth = width * zoom;
      scaledHeight = height * zoom;
    } else {
      scaledWidth = height * zoom;
      scaledHeight = width * zoom;
    }

    return { width: scaledWidth, height: scaledHeight };
  };

  const thumbnails = Array.from({ length: totalPages }, (_, i) => (
    <div
      key={i}
      className={`cursor-pointer p-2 ${currentPage === i + 1 ? "bg-accent" : ""} hover:bg-accent/50 transition-colors`}
      onClick={() => scrollToPage(i + 1)}
    >
      <div className="aspect-[1/1.4] bg-background shadow-md flex items-center justify-center overflow-hidden">
        {pdfSource && (
          <Document file={pdfSource}>
            <Page
              pageNumber={i + 1}
              width={180}
              height={232}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              rotate={rotation}
            />
          </Document>
        )}
      </div>
    </div>
  ));


  return (
    <div className={`flex h-screen bg-background text-foreground ${theme}`}>
      <div
        className={`${sidebarOpen ? "w-64" : "w-0"} transition-all duration-300 overflow-hidden border-r border-border bg-background`}
      >
        <ScrollArea className="h-full">
          <div className="grid grid-cols-1 gap-4 p-4">{thumbnails}</div>
        </ScrollArea>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between p-4 bg-background border-b border-border shadow-sm">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => scrollToPage(Math.max(1, currentPage - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-1">
                <Input
                  type="number"
                  value={currentPage}
                  onChange={(e) => scrollToPage(Number(e.target.value))}
                  className="w-16 text-center"
                />
                <span className="text-sm text-muted-foreground">/ {totalPages}</span>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => scrollToPage(Math.min(totalPages, currentPage + 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
          </div>
          <div className="flex space-x-4">
              <div className="flex-1">
                <input type="file" accept="application/pdf" onChange={handleFileChange} className="w-full" />
              </div>
              <div className="flex-1">
                <form 
                onSubmit={handleUrlSubmit} 
                className="flex space-x-2">
                  <Input
                    type="url"
                    placeholder="Enter PDF URL"
                    value={pdfUrl}
                    onChange={(e) => setPdfUrl(e.target.value)}
                    className="flex-1"
                    style={{width:'40vh'}}
                  />
                  <Button type="submit" variant="outline">
                    <Link className="h-4 w-4 mr-2" />
                    Load URL
                  </Button>
                </form>
              </div>
            </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={() => setZoom((prev) => Math.max(0.5, prev - 0.1))}>
                <Minus className="h-4 w-4" />
              </Button>
              <Slider
                value={[zoom]}
                onValueChange={(value) => setZoom(value[0])}
                max={3}
                min={0.5}
                step={0.1}
                className="w-32"
              />
              <Button variant="outline" size="icon" onClick={() => setZoom((prev) => Math.min(3, prev + 0.1))}>
                <Plus className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">{Math.round(zoom * 100)}%</span>
            </div>
            <Button variant="outline" size="icon" onClick={handleRotation}>
              <RotateCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleDownload} disabled={!pdfSource}>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={toggleTheme}>
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-8 flex justify-center items-start" ref={mainContentRef}>
        <div className="w-full max-w-5xl">
    

            {pdfSource && (
              <Document
                file={pdfSource}
                onLoadError={(error) => console.error('Load Error:', error)}
                onLoadSuccess={onDocumentLoadSuccess}
              >
                {Array.from(new Array(totalPages), (_, index) => {
                  const { width, height } = calculatePageDimensions(800, 1000); // Adjust base width and height
                  return (
                    <div
                      key={`page_${index + 1}`}
                      className="mb-8 flex justify-center " // Add shadow and other styles
                    >
                      <Page
                      className='bg-white rounded-lg p-4 shadow-lg'
                        pageNumber={index + 1}
                        width={width}
                        height={height}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        rotate={rotation} // Apply rotation to PDF pages
                      />
                    </div>
                  );
                })}
              </Document>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
