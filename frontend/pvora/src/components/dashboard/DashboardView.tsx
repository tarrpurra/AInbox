import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

const DashboardView = () => {
  const [emails, setEmails] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.defaults.withCredentials = true;
  }, []);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/emails");
        setEmails(res.data);
        setError("");
      } catch (err) {
        setError("Failed to load emails: " + (err.response?.data?.error || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, []);

  const priorityOptions = ["high", "medium", "low", "urgent", "important"];

  const filteredEmails = selectedCategory
    ? emails.filter(
        (e) =>
          e.classification?.priority?.toLowerCase() === selectedCategory.toLowerCase() ||
          e.classification?.label?.toLowerCase() === selectedCategory.toLowerCase()
      )
    : [];

  const generateSummaryCounts = () => {
    const priorityMap = {};
    const sentimentMap = {};
    const labelMap = {};
    const intentMap = {};

    emails.forEach((e) => {
      const { priority, sentiment, label, intent } = e.classification || {};

      if (priority) {
        priorityMap[priority] = (priorityMap[priority] || 0) + 1;
      }
      if (sentiment) {
        sentimentMap[sentiment] = (sentimentMap[sentiment] || 0) + 1;
      }
      if (label) {
        labelMap[label] = (labelMap[label] || 0) + 1;
      }
      if (intent) {
        intentMap[intent] = (intentMap[intent] || 0) + 1;
      }
    });

    return { priorityMap, sentimentMap, labelMap, intentMap };
  };

  const { priorityMap, sentimentMap, labelMap, intentMap } = generateSummaryCounts();

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">📊 AI Email Dashboard</h1>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filter Buttons */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {priorityOptions.map((p) => (
          <Button
            key={p}
            variant={selectedCategory === p ? "default" : "outline"}
            onClick={() => setSelectedCategory(p === selectedCategory ? "" : p)}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </Button>
        ))}
      </div>

      {/* Loading */}
      {loading ? (
        Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="mb-6">
            <CardHeader>
              <Skeleton className="h-5 w-1/2 mb-2" />
              <Skeleton className="h-4 w-1/3" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-2/3" />
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))
      ) : selectedCategory && filteredEmails.length > 0 ? (
        filteredEmails.map((email, index) => (
          <Card key={index} className="mb-4">
            <CardHeader>
              <CardTitle className="text-md">{email.subject}</CardTitle>
              <CardDescription>From: {email.from}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2 text-sm">
              <Badge variant="secondary">Priority: {email.classification.priority}</Badge>
              <Badge variant="outline">Sentiment: {email.classification.sentiment}</Badge>
              <Badge variant="outline">Label: {email.classification.label}</Badge>
              <Badge variant="outline">Intent: {email.classification.intent}</Badge>
            </CardContent>
          </Card>
        ))
      ) : !selectedCategory ? (
        <Card className="p-6 mb-6">
          <CardHeader>
            <CardTitle>Email Summary Insights</CardTitle>
            <CardDescription>Overview of AI classifications</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Priority Counts</h4>
              <ul className="list-disc ml-5">
                {Object.entries(priorityMap).map(([key, count]) => (
                  <li key={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}: {count}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Sentiment Counts</h4>
              <ul className="list-disc ml-5">
                {Object.entries(sentimentMap).map(([key, count]) => (
                  <li key={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}: {count}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Label Counts</h4>
              <ul className="list-disc ml-5">
                {Object.entries(labelMap).map(([key, count]) => (
                  <li key={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}: {count}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Intent Counts</h4>
              <ul className="list-disc ml-5">
                {Object.entries(intentMap).map(([key, count]) => (
                  <li key={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}: {count}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      ) : (
        <p className="text-gray-500">No emails matched the selected category.</p>
      )}
    </div>
  );
};

export default DashboardView;
