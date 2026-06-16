'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useLanguage } from '@/contexts/language-context';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, MapPin, Phone, Linkedin, Github } from 'lucide-react';

export function ContactForm() {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        alert('Message sent successfully!');

        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
      }
    } catch (error) {
      console.error(error);
      alert('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <section className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t('contact.title')}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('contact.description')}
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-8 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Contact Info Cards */}
          <motion.div
            className="p-6 rounded-lg bg-muted border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg"
            variants={itemVariants}
            whileHover={{ y: -4 }}
          >
            <Mail className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-2">
              {t('contact.contactInfo')}
            </h3>
            <p className="text-muted-foreground text-sm">rizqifauzi.id@gmail.com</p>
          </motion.div>

          <motion.div
            className="p-6 rounded-lg bg-muted border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg"
            variants={itemVariants}
            whileHover={{ y: -4 }}
          >
            <Phone className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-2">
              {t('contact.phone')}
            </h3>
            <p className="text-muted-foreground text-sm">+62 822-6156-9418</p>
          </motion.div>

          <motion.div
            className="p-6 rounded-lg bg-muted border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg"
            variants={itemVariants}
            whileHover={{ y: -4 }}
          >
            <MapPin className="w-8 h-8 text-primary mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-2">
              {t('contact.location')}
            </h3>
            <p className="text-muted-foreground text-sm">Indonesia</p>
          </motion.div>
        </motion.div>

        {/* Form and Social */}
        <motion.div
          className="grid md:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Contact Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="p-8 rounded-lg bg-muted border border-border/50"
            variants={itemVariants}
          >
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t('contact.form.name')}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-background border border-border hover:border-primary/50 focus:outline-none focus:border-primary transition-colors"
                  placeholder="Your Name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t('contact.form.email')}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-background border border-border hover:border-primary/50 focus:outline-none focus:border-primary transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t('contact.form.subject')}
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-background border border-border hover:border-primary/50 focus:outline-none focus:border-primary transition-colors"
                  placeholder="Subject"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t('contact.form.message')}
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2 rounded-lg bg-background border border-border hover:border-primary/50 focus:outline-none focus:border-primary transition-colors resize-none"
                  placeholder="Your message..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {isLoading ? t('contact.form.sending') : t('contact.form.send')}
              </button>
            </div>
          </motion.form>

          {/* Social Links */}
          <motion.div
            className="p-8 rounded-lg bg-muted border border-border/50 flex flex-col justify-center"
            variants={itemVariants}
          >
            <h3 className="text-2xl font-bold text-foreground mb-8">
              Let&apos;s Connect
            </h3>
            <div className="space-y-4">
              <a
                href="mailto:rizqifauzi.id@gmail.com"
                className="flex items-center gap-4 p-4 rounded-lg bg-background hover:bg-background/80 transition-colors"
              >
                <Mail className="w-6 h-6 text-primary" />
                <span>Email</span>
              </a>
              <a
                href="https://linkedin.com"
                target="https://www.linkedin.com/in/rizqi-fauzi-417575336/"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-lg bg-background hover:bg-background/80 transition-colors"
              >
                <Linkedin className="w-6 h-6 text-primary" />
                <span>LinkedIn</span>
              </a>
              <a
                href="https://github.com"
                target="https://github.com/RizqiFauu"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-lg bg-background hover:bg-background/80 transition-colors"
              >
                <Github className="w-6 h-6 text-primary" />
                <span>GitHub</span>
              </a>
              <a
                href="https://wa.me/6282261569418"
                target="https://wa.me/6282261569418"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-lg bg-background hover:bg-background/80 transition-colors"
              >
                <MessageSquare className="w-6 h-6 text-primary" />
                <span>WhatsApp</span>
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
