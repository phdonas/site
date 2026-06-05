import React, { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface Props {
  items: FAQItem[];
}

const FAQAccordion: React.FC<Props> = ({ items }) => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div>
      {items.map((item, i) => (
        <div key={i} className={`faq-item ${open === i ? 'open' : ''}`}>
          <button
            className="faq-btn"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span className="faq-q">{item.question}</span>
            <span className="faq-icon">+</span>
          </button>
          <p className="faq-a">{item.answer}</p>
        </div>
      ))}
    </div>
  );
};

export { FAQAccordion };
export default FAQAccordion;
