import React, { useState } from "react";
import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";
import Select from "../components/Select";
import Badge from "../components/Badge";
import Modal from "../components/Modal";
import Toast from "../components/Toast";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";

const DesignPreview = () => {
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Toast state
  const [toast, setToast] = useState({ isOpen: false, message: "", type: "info" });

  // Form input states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    domain: "",
  });

  const showToast = (message, type) => {
    setToast({ isOpen: true, message, type });
  };

  return (
    <div className="page-container" style={{ maxWidth: "1100px", paddingBottom: "4rem" }}>
      <div style={{ marginBottom: "2.5rem", textAlign: "center" }}>
        <span className="badge badge-lavender" style={{ marginBottom: "0.5rem" }}>
          🎨 Design System Showcase
        </span>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "700" }}>Pastel Theme Preview</h1>
        <p style={{ color: "var(--text-muted)", maxWidth: "600px", margin: "0.5rem auto 0" }}>
          Poppins typography, soft lavender focus glows, hover-lift cards, and pastel color tokens.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
        {/* 1. BUTTONS */}
        <Card>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>1. Buttons</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
            <Button variant="primary" onClick={() => showToast("Primary button clicked!", "info")}>
              Primary Button
            </Button>
            <Button variant="secondary" onClick={() => showToast("Secondary button clicked!", "info")}>
              Secondary Button
            </Button>
            <Button variant="danger" onClick={() => showToast("Danger action clicked!", "error")}>
              Danger Button
            </Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
            <Button variant="primary" loading>
              Loading
            </Button>
          </div>
        </Card>

        {/* 2. BADGES */}
        <Card>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>2. Pastel Badges</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
            <Badge variant="lavender">Lavender / Primary</Badge>
            <Badge variant="mint">Mint / Web Development</Badge>
            <Badge variant="peach">Peach / Marketing</Badge>
            <Badge variant="rose">Rose / Expiring Soon</Badge>
            <Badge variant="sky">Sky / Data Science</Badge>
          </div>
        </Card>

        {/* 3. INPUTS & FORM CONTROLS */}
        <Card>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>
            3. Form Controls (Soft Lavender Focus Glow)
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
            <Input
              label="Full Name"
              name="name"
              placeholder="e.g. Aarushi Sharma"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              helperText="Notice the soft lavender focus ring when you click."
              required
            />
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="e.g. applicant@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              error={formData.email && !formData.email.includes("@") ? "Please enter a valid email address" : ""}
            />
            <Select
              label="Domain Category"
              name="domain"
              value={formData.domain}
              onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
              options={[
                "Web Development",
                "Data Science",
                "Design",
                "Marketing",
                "Cloud Computing",
              ]}
              placeholder="Choose a domain..."
              required
            />
          </div>
        </Card>

        {/* 4. CARDS & HOVER LIFT */}
        <div>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>4. Cards (Hover Lift Effect)</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
            <Card interactive onClick={() => showToast("Opportunity Card 1 clicked!", "info")}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <Badge variant="mint">Web Development</Badge>
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Remote</span>
              </div>
              <h3 style={{ fontSize: "1.15rem", marginBottom: "0.4rem" }}>Frontend Developer Intern</h3>
              <p style={{ color: "var(--primary)", fontWeight: "500", fontSize: "0.9rem", marginBottom: "0.5rem" }}>
                PixelCraft Studios
              </p>
              <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                Hover over this card to see the smooth lift animation and pastel shadow glow.
              </p>
            </Card>

            <Card interactive onClick={() => showToast("Opportunity Card 2 clicked!", "info")}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <Badge variant="sky">Data Science</Badge>
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Bangalore</span>
              </div>
              <h3 style={{ fontSize: "1.15rem", marginBottom: "0.4rem" }}>AI & ML Intern</h3>
              <p style={{ color: "var(--primary)", fontWeight: "500", fontSize: "0.9rem", marginBottom: "0.5rem" }}>
                InsightAI Labs
              </p>
              <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                Fully responsive grid that adapts across mobile, tablet, and desktop views.
              </p>
            </Card>
          </div>
        </div>

        {/* 5. MODAL & TOAST TRIGGERS */}
        <Card>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>5. Interactive Overlays (Modal & Toast)</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
            <Button variant="primary" onClick={() => setIsModalOpen(true)}>
              Open Demo Modal
            </Button>
            <Button variant="secondary" onClick={() => showToast("Application submitted successfully!", "success")}>
              Trigger Success Toast
            </Button>
            <Button variant="secondary" onClick={() => showToast("Invalid opportunity ID provided.", "error")}>
              Trigger Error Toast
            </Button>
          </div>
        </Card>

        {/* 6. SPINNERS */}
        <Card>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>6. Spinners (Loading States)</h2>
          <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
            <Spinner size="sm" />
            <Spinner size="md" />
            <Spinner size="lg" />
          </div>
        </Card>

        {/* 7. EMPTY STATE */}
        <div>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>7. Empty State Component</h2>
          <EmptyState
            icon="🔎"
            title="No Opportunities Found"
            message="We couldn't find any listings matching your search or domain filters."
            actionText="Clear All Filters"
            onAction={() => showToast("Filters reset to default!", "info")}
          />
        </div>
      </div>

      {/* Modal Demonstration */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Sample Application Modal"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setIsModalOpen(false);
                showToast("Action confirmed via modal!", "success");
              }}
            >
              Confirm Action
            </Button>
          </>
        }
      >
        <p style={{ color: "var(--text-body)", fontSize: "0.925rem", marginBottom: "1rem" }}>
          This modal features a soft backdrop blur, smooth scale-up animation, and auto-dismiss on clicking
          outside or pressing the <strong>Escape</strong> key.
        </p>
        <Input
          label="Quick Feedback"
          placeholder="How does this design look?"
        />
      </Modal>

      {/* Toast Notification */}
      <Toast
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isOpen: false })}
      />
    </div>
  );
};

export default DesignPreview;
