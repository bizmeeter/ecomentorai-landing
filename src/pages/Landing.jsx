// pages/Landing.jsx
import React from "react";
import SignupForm from "../components/SignupForm";
import ChapterOneQuestions from "../components/ChapterOneQuestions";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4">
      {/* HERO SECTION */}
      <div className="max-w-4xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-extrabold text-blue-800 mb-4">
          The only Ecomentor you really need.
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Smart guidance, daily tasks, growth plans —
          <br />
          For less than a coffee meeting with a consultant.
        </p>

        {/* Signup Form עם טקסט כפתור מעודכן */}
        <SignupForm />
      </div>

      {/* פרק ראשון – שאלון פתיחה + Ask */}
      <div className="max-w-6xl mx-auto">
        <ChapterOneQuestions />
      </div>

      {/* CTA תחתון */}
      <div className="mt-16 text-center">
        <h3 className="text-2xl font-semibold text-green-600 mb-2">
          🟢 Ready to take an action?
        </h3>
        <p className="text-md text-gray-700 mb-4">
          Join now, to get an invite for a Beta asap and start managing your store like a pro.
        </p>
        <button className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 font-bold">
          Get invite for a beta with 50% discount, available for 100 customers. Save your spot. Be the 1st to know
        </button>
      </div>
    </div>
  );
};

export default Landing;
