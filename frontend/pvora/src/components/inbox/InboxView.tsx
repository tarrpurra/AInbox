import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const Inbox = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingEmailId, setLoadingEmailId] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

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
        console.error("Error fetching emails:", err);
        if (err.response?.status === 401) {
          setError("Your session has expired. Please log in again.");
        } else {
          setError(`Failed to load emails: ${err.response?.data?.error || err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, []);

  const handleRetry = () => {
    setError("");
    setLoading(true);
    axios
      .get("http://localhost:5000/api/emails")
      .then((res) => setEmails(res.data))
      .catch((err) => {
        console.error("Retry error:", err);
        if (err.response?.status === 401) {
          setError("Your session has expired. Please log in again.");
        } else {
          setError(`Failed to load emails: ${err.response?.data?.error || err.message}`);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleNavigateToDetails = (emailId) => {
    setLoadingEmailId(emailId);
    navigate(`/inbox/${emailId}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Inbox</h1>

      {error && (
        <div className="mb-4 text-red-500">
          <p>{error}</p>
          <Button onClick={handleRetry} className="mt-2">
            Retry
          </Button>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-md" />
          ))}
        </div>
      ) : (
        <ul className="space-y-4">
          {emails.map((email) => (
            <li
              key={email.id}
              className="border p-4 rounded-md cursor-pointer hover:bg-gray-50"
              onClick={() => handleNavigateToDetails(email.id)}
            >
              <div className="flex justify-between">
                <h3 className="text-lg font-semibold">{email.subject}</h3>
                {loadingEmailId === email.id && (
                  <span className="text-sm text-blue-500">Loading...</span>
                )}
              </div>
              <p className="text-sm text-gray-500">From: {email.from}</p>
              <p className="text-xs text-gray-400">{email.snippet}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Inbox;
