import { useParams } from "react-router-dom";
import EmailSummaryAndReply from "@/components/inbox/EmailSummaryAndReply";
import axios from "axios";
import { useEffect, useState } from "react";

const EmailSummaryPage = () => {
  const { emailId } = useParams();
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/emails/${emailId}`,
          { withCredentials: true }
        );
        setEmail(res.data);
      } catch (err) {
        console.error("Error fetching email:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmail();
  }, [emailId]);

  if (loading) return <p className="p-6">Loading email...</p>;
  if (!email) return <p className="p-6 text-red-500">Email not found.</p>;

  return (
    <div className="p-6">
      <EmailSummaryAndReply email={email} />
    </div>
  );
};

export default EmailSummaryPage;
