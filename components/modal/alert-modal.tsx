"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export const AlertModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
}: AlertModalProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title="?אתה בטוח שאתה רוצה למחוק"
      description="אי אפשר לשחזר לאחר מכן"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="pt-6 space-x-2 flex items-center justify-center w-full">
        <Button disabled={loading} variant={"outline"} onClick={onClose}>
          ביטול
        </Button>
        <Button disabled={loading} variant={"destructive"} onClick={onConfirm}>
          אישור
        </Button>
      </div>
    </Modal>
  );
};
