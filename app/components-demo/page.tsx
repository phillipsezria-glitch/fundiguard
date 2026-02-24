"use client";

import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/ui/Button";
import StatusPill from "../components/ui/StatusPill";
import RatingStars from "../components/ui/RatingStars";
import FundiCard from "../components/ui/FundiCard";
import ServiceCategoryCard from "../components/ui/ServiceCategoryCard";
import PhotoUploader from "../components/ui/PhotoUploader";
import Modal from "../components/ui/Modal";
import TrustBar from "../components/ui/TrustBar";

export default function ComponentsDemo() {
  const [modalOpen, setModalOpen] = useState(false);
  const [rating, setRating] = useState(3.5);

  return (
    <div style={{ minHeight: "100vh" }}>
      <Header />

      <main style={{ padding: "40px 20px", maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ fontFamily: "Poppins", fontSize: "2.5rem", marginBottom: "40px" }}>
          ✨ FundiGuard Components Demo
        </h1>

        {/* TrustBar Section */}
        <section style={{ marginBottom: "60px" }}>
          <h2 style={{ fontFamily: "Poppins", fontSize: "1.8rem", marginBottom: "24px" }}>
            🔒 TrustBar Component
          </h2>
          <TrustBar />
        </section>

        {/* Buttons Section */}
        <section style={{ marginBottom: "60px" }}>
          <h2 style={{ fontFamily: "Poppins", fontSize: "1.8rem", marginBottom: "24px" }}>
            🔘 Buttons (Primary, Secondary, Danger)
          </h2>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "flex-start" }}>
            <Button variant="primary" size="sm">Small Primary</Button>
            <Button variant="primary" size="md">Medium Primary</Button>
            <Button variant="primary" size="lg">Large Primary</Button>
            <Button variant="secondary" size="md">Secondary</Button>
            <Button variant="danger" size="md">Danger</Button>
            <Button variant="primary" disabled size="md">Disabled</Button>
            <Button variant="primary" size="md" fullWidth style={{ maxWidth: "300px" }}>Full Width</Button>
          </div>
        </section>

        {/* StatusPill Section */}
        <section style={{ marginBottom: "60px" }}>
          <h2 style={{ fontFamily: "Poppins", fontSize: "1.8rem", marginBottom: "24px" }}>
            🏷️ StatusPill Badges
          </h2>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <StatusPill type="verified" label="Verified" />
            <StatusPill type="online" label="Online Now" />
            <StatusPill type="urgent" label="Urgent Needed" />
            <StatusPill type="success" label="Job Completed" />
            <StatusPill type="pending" label="In Progress" />
          </div>
        </section>

        {/* RatingStars Section */}
        <section style={{ marginBottom: "60px" }}>
          <h2 style={{ fontFamily: "Poppins", fontSize: "1.8rem", marginBottom: "24px" }}>
            ⭐ RatingStars
          </h2>
          <div style={{ display: "flex", gap: "32px", flexDirection: "column" }}>
            <div>
              <p style={{ marginBottom: "12px" }}>Non-interactive: 5.0 (234 reviews)</p>
              <RatingStars score={5} count={234} size="md" />
            </div>
            <div>
              <p style={{ marginBottom: "12px" }}>Current: {rating.toFixed(1)} (Interactive)</p>
              <RatingStars score={rating} count={0} size="lg" interactive onRate={setRating} />
              <p style={{ marginTop: "12px", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                Click on stars to rate
              </p>
            </div>
            <div>
              <p style={{ marginBottom: "12px" }}>Small: 4.2 (89 reviews)</p>
              <RatingStars score={4.2} count={89} size="sm" />
            </div>
          </div>
        </section>

        {/* ServiceCategoryCard Section */}
        <section style={{ marginBottom: "60px" }}>
          <h2 style={{ fontFamily: "Poppins", fontSize: "1.8rem", marginBottom: "24px" }}>
            🏷️ ServiceCategoryCard
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
            gap: "16px",
          }}>
            <ServiceCategoryCard icon="🔧" name="Plumbing" count={234} />
            <ServiceCategoryCard icon="⚡" name="Electrical" count={189} />
            <ServiceCategoryCard icon="🪚" name="Carpentry" count={156} />
            <ServiceCategoryCard icon="🎨" name="Painting" count={203} />
            <ServiceCategoryCard icon="🧹" name="Cleaning" count={412} />
            <ServiceCategoryCard icon="📚" name="Tutoring" count={321} />
          </div>
        </section>

        {/* FundiCard Section */}
        <section style={{ marginBottom: "60px" }}>
          <h2 style={{ fontFamily: "Poppins", fontSize: "1.8rem", marginBottom: "24px" }}>
            👤 FundiCard (Fundi Profiles)
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "20px",
          }}>
            <FundiCard
              id="1"
              name="John Kipchoge"
              skill="Master Plumber"
              location="South C, Nairobi"
              price={1500}
              rating={4.9}
              ratingCount={127}
              verified={true}
              online={true}
            />
            <FundiCard
              id="2"
              name="Jane Akothee"
              skill="Interior Designer"
              location="Westlands, Nairobi"
              price={5000}
              rating={4.7}
              ratingCount={89}
              verified={true}
              online={false}
            />
            <FundiCard
              id="3"
              name="Mike Omondi"
              skill="Electrician"
              location="Kasarani, Nairobi"
              price={2000}
              rating={4.6}
              ratingCount={54}
              verified={false}
              online={true}
            />
          </div>
        </section>

        {/* PhotoUploader Section */}
        <section style={{ marginBottom: "60px" }}>
          <h2 style={{ fontFamily: "Poppins", fontSize: "1.8rem", marginBottom: "24px" }}>
            📸 PhotoUploader (Drag & Drop)
          </h2>
          <div style={{ maxWidth: "500px" }}>
            <PhotoUploader
              maxFiles={5}
              maxSizeMB={10}
              onPhotosSelected={(files) => {
                console.log(`Selected ${files.length} photos`);
              }}
            />
          </div>
        </section>

        {/* Modal Section */}
        <section style={{ marginBottom: "60px" }}>
          <h2 style={{ fontFamily: "Poppins", fontSize: "1.8rem", marginBottom: "24px" }}>
            🪟 Modal Dialog
          </h2>
          <Button variant="primary" onClick={() => setModalOpen(true)}>
            Open Modal Example
          </Button>
          <Modal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Example Modal"
            size="md"
          >
            <p>This is a modal component example. You can use it for confirmations, forms, or any important information.</p>
            <p style={{ marginTop: "12px", color: "var(--text-secondary)" }}>
              Click the X button or outside the modal to close it.
            </p>
            <div style={{ marginTop: "20px", display: "flex", gap: "12px" }}>
              <Button variant="primary" onClick={() => setModalOpen(false)}>
                Close
              </Button>
              <Button variant="secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </Modal>
        </section>

        {/* Testing Info */}
        <section style={{
          background: "var(--green-light)",
          padding: "24px",
          borderRadius: "var(--radius)",
          marginBottom: "60px",
        }}>
          <h3 style={{ fontFamily: "Poppins", marginTop: 0 }}>✅ Component Testing Checklist</h3>
          <ul style={{ margin: 0, paddingLeft: "20px" }}>
            <li>✅ Button hover effects (translateY, shadow)</li>
            <li>✅ StatusPill color variants (verified, online, urgent, etc.)</li>
            <li>✅ RatingStars interactive feedback</li>
            <li>✅ ServiceCategoryCard hover animations</li>
            <li>✅ FundiCard with verified badges & online status</li>
            <li>✅ PhotoUploader drag-drop & preview</li>
            <li>✅ Modal open/close & overlay</li>
            <li>✅ TrustBar grid layout (4 items)</li>
            <li>✅ Responsive grid layouts (mobile-friendly)</li>
            <li>✅ All color tokens & typography working</li>
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  );
}
