import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";

/**
 * Generic CRUD hook for a REST collection.
 * @param {string} endpoint   — e.g. "/api/services"
 * @param {object} emptyForm  — shape of a blank form
 */
export function useCrud(endpoint, emptyForm) {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");
  const [editing, setEditing] = useState(null);   // null | { _id } | doc
  const [form,    setForm]    = useState(emptyForm);

  const isNew = editing && !editing._id;
  const isEdit = editing && !!editing._id;

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch(endpoint);
      setItems(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => { load(); }, [load]);

  const startCreate = () => { setEditing({ _id: null }); setForm(emptyForm); };

  const startEdit = (doc) => {
    setEditing(doc);
    const f = {};
    Object.keys(emptyForm).forEach(k => { f[k] = doc[k] ?? emptyForm[k]; });
    setForm(f);
  };

  const cancel = () => { setEditing(null); setForm(emptyForm); setError(""); };

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      if (isEdit) {
        await apiFetch(`${endpoint}/${editing._id}`, { method: "PUT",  auth: true, body: JSON.stringify(form) });
      } else {
        await apiFetch(endpoint,                     { method: "POST", auth: true, body: JSON.stringify(form) });
      }
      cancel();
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (doc) => {
    if (!window.confirm(`Supprimer "${doc.title || doc.name || "cet élément"}" ?`)) return;
    setError("");
    try {
      await apiFetch(`${endpoint}/${doc._id}`, { method: "DELETE", auth: true });
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  const patch = (key, value) => setForm(f => ({ ...f, [key]: value }));

  return {
    items, loading, saving, error, editing, form,
    isNew, isEdit,
    load, startCreate, startEdit, cancel, save, remove, patch,
  };
}
