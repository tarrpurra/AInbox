
import { useState } from "react";
import { Bot, Copy, MessageCircle, X, CheckCircle, CheckSquare, RefreshCw, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface AIActionBarProps {
  email: any;
}

const replyTemplates = [
  {
    id: "agree",
    label: "Agree/Accept",
    content: "Thanks for reaching out. I've reviewed the information and I'm happy to confirm that I can [action requested]. I'll [next steps] and get back to you by [timeframe].",
  },
  {
    id: "request-info",
    label: "Request More Info",
    content: "Thank you for your email. Before I can proceed, I need a bit more information about [specific aspect]. Could you please provide [details needed] so I can better assist you?",
  },
  {
    id: "defer",
    label: "Defer/Delay",
    content: "I appreciate you reaching out about this. I'm currently focused on another priority, but I'll be able to look at this by [specific date/time]. If this is urgent, please let me know.",
  },
  {
    id: "decline",
    label: "Decline Politely",
    content: "Thank you for thinking of me for this opportunity. Unfortunately, I won't be able to [requested action] at this time due to [brief reason]. I wish you all the best with [their project/request].",
  },
];

const AIActionBar = ({ email }: AIActionBarProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [customReply, setCustomReply] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReply, setGeneratedReply] = useState("");
  
  const handleGenerateReply = () => {
    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false);
      
      // Use template or generate custom response
      if (selectedTemplate) {
        const template = replyTemplates.find(t => t.id === selectedTemplate);
        if (template) {
          const filledTemplate = template.content
            .replace("[action requested]", "review the proposal")
            .replace("[next steps]", "share my feedback with the team")
            .replace("[timeframe]", "tomorrow morning")
            .replace("[specific aspect]", "the project scope")
            .replace("[details needed]", "the expected timeline and budget constraints")
            .replace("[specific date/time]", "Thursday this week")
            .replace("[requested action]", "attend the conference")
            .replace("[brief reason]", "prior commitments")
            .replace("[their project/request]", "your event");
            
          setGeneratedReply(filledTemplate);
        }
      } else {
        // Sample custom AI-generated reply based on email content
        setGeneratedReply(`Hi ${email.sender.split(" ")[0]},

Thank you for sharing the ${email.subject.toLowerCase().includes("proposal") ? "proposal" : "information"}. I've reviewed it and will provide my feedback by the end of the day as requested.

The approach looks promising, especially the section on ${email.subject.toLowerCase().includes("timeline") ? "updated timelines" : "main deliverables"}. I have a few quick questions that we can discuss during our next meeting.

Best regards,
[Your Name]`);
      }
    }, 1500);
  };
  
  const handleCopyReply = () => {
    navigator.clipboard.writeText(generatedReply);
    toast.success("Reply copied to clipboard");
  };
  
  return (
    <Card className="mb-4 border-t-4 border-t-blue-500 animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Bot size={20} className="mr-2 text-blue-500" />
            <CardTitle className="text-lg">AI Assistant</CardTitle>
          </div>
        </div>
        <CardDescription>AI analysis and suggested actions</CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="summary" className="w-full">
          <TabsList className="grid grid-cols-3 mb-2">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="reply">Generate Reply</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary">
            <div className="space-y-4">
              <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                <p className="text-sm font-medium mb-1">AI Summary</p>
                <p className="text-sm">{email.aiSummary}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Key Points</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li className="text-sm">The <span className="ai-highlight">project proposal requires your review</span> by EOD</li>
                  <li className="text-sm">Client is expecting your <span className="ai-highlight">feedback by tomorrow morning</span></li>
                  <li className="text-sm">The proposal includes budget adjustments</li>
                </ul>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Sentiment Analysis</p>
                <div className="flex items-center">
                  <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 w-3/4"></div>
                  </div>
                  <span className="ml-2 text-xs">High Priority</span>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="reply">
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                <p className="text-sm font-medium mb-2">Response Type</p>
                <RadioGroup defaultValue="" onValueChange={setSelectedTemplate} value={selectedTemplate}>
                  <div className="grid grid-cols-2 gap-2">
                    {replyTemplates.map(template => (
                      <div key={template.id} className="flex items-start space-x-2">
                        <RadioGroupItem value={template.id} id={template.id} />
                        <Label htmlFor={template.id} className="text-sm font-normal">
                          {template.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
              
              {!generatedReply ? (
                <div className="space-y-3">
                  <p className="text-sm font-medium">Custom Instructions (Optional)</p>
                  <Textarea 
                    placeholder="Add any specific points you want included in the response..."
                    className="text-sm h-20"
                    value={customReply}
                    onChange={(e) => setCustomReply(e.target.value)}
                  />
                  
                  <Button 
                    className="w-full" 
                    onClick={handleGenerateReply} 
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw size={16} className="mr-2 animate-spin" />
                        Generating Reply...
                      </>
                    ) : (
                      <>
                        <Bot size={16} className="mr-2" />
                        Generate AI Reply
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="border border-gray-200 rounded-md p-3 bg-white">
                    <p className="text-sm whitespace-pre-wrap">{generatedReply}</p>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setGeneratedReply("")}>
                      <RefreshCw size={16} className="mr-2" />
                      Regenerate
                    </Button>
                    <Button onClick={handleCopyReply}>
                      <Copy size={16} className="mr-2" />
                      Copy to Clipboard
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="tasks">
            <div className="space-y-4">
              <div className="bg-green-50 p-3 rounded-md border border-green-100">
                <p className="text-sm font-medium mb-2">Extracted Action Items</p>
                {email.actionItems.map((item: string, idx: number) => (
                  <div key={idx} className="flex items-center mb-2 last:mb-0">
                    <CheckSquare size={16} className="mr-2 text-green-600" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
              
              <div>
                <p className="text-sm font-medium mb-2">Suggested Follow-ups</p>
                <div className="flex items-center mb-2">
                  <Clock size={16} className="mr-2 text-blue-600" />
                  <span className="text-sm">Follow up if no response by tomorrow</span>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button variant="outline" size="sm" className="text-sm">
                  <CheckCircle size={14} className="mr-1.5" />
                  Add to Tasks
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AIActionBar;
