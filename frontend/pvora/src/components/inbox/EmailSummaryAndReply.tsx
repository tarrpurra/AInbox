import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EmailSummaryAndReply = ({ email }) => {
  const navigate = useNavigate();
  const [showFullBody, setShowFullBody] = useState(false);

  const truncatedBody =
    email.body?.length > 250 ? email.body.slice(0, 250) + "..." : email.body;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Navigation */}
      <div className="flex items-center gap-2 mb-2">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Inbox
        </Button>
      </div>

      {/* Email Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            {email.subject}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-gray-600">
            <strong>From:</strong> {email.from}
          </p>

          <div className="text-sm bg-gray-50 border border-gray-200 p-4 rounded-md relative">
            {showFullBody ? email.body : truncatedBody || "No body available."}

            {email.body?.length > 250 && (
              <div className="text-right mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFullBody((prev) => !prev)}
                  className="text-blue-600 hover:underline"
                >
                  {showFullBody ? (
                    <>
                      Show less <ChevronUp className="ml-1 w-4 h-4" />
                    </>
                  ) : (
                    <>
                      Show more <ChevronDown className="ml-1 w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* AI Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-md font-medium">📌 AI Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-800">
            {email.summary || "No summary available."}
          </p>
        </CardContent>
      </Card>

      {/* Suggested Reply */}
      <Card>
        <CardHeader>
          <CardTitle className="text-md font-medium">💬 Suggested Reply</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-800">
            {email.reply || "No reply suggestion available."}
          </p>
        </CardContent>
      </Card>

      {/* Sentiment Analysis Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-md font-medium">📊 Sentiment Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-400"
              style={{ width: "70%" /* You can adjust dynamically */ }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>Low Priority</span>
            <span>High Priority</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailSummaryAndReply;
