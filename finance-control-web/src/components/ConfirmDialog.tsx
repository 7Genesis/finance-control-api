"use client";

import styles from "@/styles/confirm.module.css";

interface Props {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <p className={styles.message}>{message}</p>

        <div className={styles.actions}>
          <button
            className={styles.cancel}
            onClick={onCancel}
          >
            Cancelar
          </button>

          <button
            className={styles.confirm}
            onClick={onConfirm}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}