"use client";

export default function ConfirmDeleteForm({
  action,
  confirmMessage = "¿Confirma que desea eliminar este registro? Esta acción no se puede deshacer.",
  label = "Eliminar",
}: {
  action: (formData: FormData) => void;
  confirmMessage?: string;
  label?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmMessage)) {
          e.preventDefault();
        }
      }}
    >
      <button type="submit" className="btn-danger">
        {label}
      </button>
    </form>
  );
}
