import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

import BackButton from "@/components/BackButton";
import { Badge } from "@/components/ui/badge";

const HostCreateExperience = () => {
  return (
    <div className="min-h-screen bg-[#f8f1e7] px-4 py-8 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mx-auto flex w-full max-w-2xl flex-col gap-10"
      >
        <BackButton
          fallbackPath="/host-dashboard"
          className="w-fit gap-2 rounded-full bg-white/60 px-4 py-2 text-muted-foreground shadow-sm backdrop-blur"
        >
          Back
        </BackButton>

        <div className="space-y-4">
          <Badge className="rounded-full bg-[#efe0cf] px-4 py-1 text-sm font-medium text-[#6d5433]">
            Host toolkit
          </Badge>
          <div className="space-y-4">
            <h1 className="text-3xl font-semibold text-[#2d2214] sm:text-4xl">
              Create a Hosted Experience
            </h1>
            <p className="text-base leading-relaxed text-[#6d5433] sm:text-lg">
              Craft a memorable gathering, add your signature touches, and publish it
              for the right guests. We&apos;ll guide you through the essentials.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-dashed border-[#ddcdb8] bg-white/70 p-6 shadow-sm backdrop-blur">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-semibold text-[#2d2214]">
                  Quality host checklist
                </h2>
                <p className="text-sm text-[#755a37]">
                  Events that complete every step convert 3x more bookings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HostCreateExperience;
