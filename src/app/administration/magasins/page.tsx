"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Building2,
  Car,
  Check,
  Clock,
  CreditCard,
  Edit,
  Mail,
  MapPin,
  Phone,
  PlusCircle,
  Trash2,
  X,
} from "lucide-react";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { ImageUpload } from "@/components/common/ImageUpload";
import { useStorePickerStore } from "@/stores/storePickerStore";
import { useStoresStore } from "@/stores/storesStore";
import type { Store } from "@/types";

const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
const serviceOptions = ["Click & Collect", "Retours gratuits", "Conseil produit", "Réservation 48h", "Accès PMR"];
const paymentOptions = ["CB", "Espèces", "Chèque", "PayPal", "Apple Pay", "Google Pay"];

const createDefaultHours = () =>
  days.map((day) => ({
    day,
    open: day === "Dimanche" ? "" : "10:00",
    close: day === "Dimanche" ? "" : "19:00",
    isClosed: day === "Dimanche",
  }));

const createEmptyForm = () => ({
  name: "",
  address: "",
  city: "",
  postalCode: "",
  phone: "",
  email: "",
  image: "",
  clickAndCollectDelay: "1",
  services: ["Click & Collect", "Réservation 48h"],
  paymentMethods: ["CB", "Espèces"],
  hasParking: true,
  lat: "",
  lng: "",
  hours: createDefaultHours(),
});

type StoreForm = ReturnType<typeof createEmptyForm>;
type TextField = Exclude<keyof StoreForm, "services" | "paymentMethods" | "hasParking" | "hours">;

const formFromStore = (store: Store): StoreForm => ({
  name: store.name,
  address: store.address,
  city: store.city,
  postalCode: store.postalCode,
  phone: store.phone,
  email: store.email,
  image: store.image,
  clickAndCollectDelay: String(store.clickAndCollectDelay),
  services: store.services.length > 0 ? store.services : ["Click & Collect"],
  paymentMethods: store.paymentMethods.length > 0 ? store.paymentMethods : ["CB"],
  hasParking: store.hasParking,
  lat: store.coordinates.lat ? String(store.coordinates.lat) : "",
  lng: store.coordinates.lng ? String(store.coordinates.lng) : "",
  hours: days.map((day) => {
    const hour = store.hours.find((item) => item.day === day);
    return {
      day,
      open: hour?.open || (day === "Dimanche" ? "" : "10:00"),
      close: hour?.close || (day === "Dimanche" ? "" : "19:00"),
      isClosed: hour?.isClosed ?? day === "Dimanche",
    };
  }),
});

const buildStore = (form: StoreForm, id: string): Store => ({
  id,
  name: form.name.trim(),
  address: form.address.trim(),
  city: form.city.trim(),
  postalCode: form.postalCode.trim(),
  phone: form.phone.trim(),
  email: form.email.trim(),
  image: form.image,
  coordinates: {
    lat: parseFloat(form.lat) || 0,
    lng: parseFloat(form.lng) || 0,
  },
  hours: form.hours.map((hour) => ({
    day: hour.day,
    open: hour.isClosed ? "" : hour.open,
    close: hour.isClosed ? "" : hour.close,
    isClosed: hour.isClosed,
  })),
  services: form.services.length > 0 ? form.services : ["Click & Collect"],
  hasParking: form.hasParking,
  paymentMethods: form.paymentMethods.length > 0 ? form.paymentMethods : ["CB"],
  clickAndCollectDelay: Math.max(1, parseInt(form.clickAndCollectDelay, 10) || 1),
});

export default function MagasinsAdminPage() {
  const { stores, addStore, updateStore, deleteStore } = useStoresStore();
  const { selectedStore, clearSelection } = useStorePickerStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<StoreForm>(createEmptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<string | null>(null);
  const [error, setError] = useState("");

  const setText = (field: TextField) =>
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setForm((current) => ({ ...current, [field]: event.target.value }));

  const toggleListValue = (field: "services" | "paymentMethods", value: string) => {
    setForm((current) => ({
      ...current,
      [field]: current[field].includes(value)
        ? current[field].filter((item) => item !== value)
        : [...current[field], value],
    }));
  };

  const updateHour = (index: number, updates: Partial<StoreForm["hours"][number]>) => {
    setForm((current) => ({
      ...current,
      hours: current.hours.map((hour, i) => (i === index ? { ...hour, ...updates } : hour)),
    }));
  };

  const openCreate = () => {
    setForm(createEmptyForm());
    setEditingId(null);
    setError("");
    setShowForm(true);
  };

  const resetForm = () => {
    setForm(createEmptyForm());
    setEditingId(null);
    setShowForm(false);
    setError("");
  };

  const validate = () => {
    if (!form.name.trim()) return "Le nom du magasin est requis";
    if (!form.address.trim()) return "L'adresse est requise";
    if (!form.city.trim()) return "La ville est requise";
    if (!form.postalCode.trim()) return "Le code postal est requis";
    if (!form.phone.trim()) return "Le téléphone est requis";
    if (!form.email.trim()) return "L'email est requis";
    if (form.hours.every((hour) => hour.isClosed)) return "Au moins un jour doit être ouvert";
    if (form.hours.some((hour) => !hour.isClosed && (!hour.open || !hour.close))) {
      return "Renseignez les horaires pour chaque jour ouvert";
    }
    return "";
  };

  const handleSave = () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!editingId && stores.some((store) => store.name.toLowerCase() === form.name.trim().toLowerCase())) {
      setError("Ce magasin existe déjà");
      return;
    }

    const id = editingId || crypto.randomUUID();
    const store = buildStore(form, id);

    if (editingId) updateStore(editingId, store);
    else addStore(store);

    resetForm();
  };

  const startEdit = (store: Store) => {
    setForm(formFromStore(store));
    setEditingId(store.id);
    setError("");
    setShowForm(true);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Mes magasins</h1>
          <p className="text-base text-gray-500 mt-1">
            {stores.length === 0
              ? "Aucun magasin renseigné"
              : `${stores.length} magasin${stores.length > 1 ? "s" : ""} visible${stores.length > 1 ? "s" : ""} sur le site`}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl text-base font-bold hover:bg-purple-700 transition-colors shadow-md shadow-purple-200"
        >
          <PlusCircle className="w-5 h-5" />
          Ajouter un magasin
        </button>
      </div>

      {stores.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
          <MapPin className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <p className="text-xl font-bold text-gray-700">Aucun magasin renseigné</p>
          <p className="text-base text-gray-400 mt-2">Ajoutez un magasin pour qu&apos;il apparaisse sur le site public.</p>
          <button
            onClick={openCreate}
            className="mt-6 inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl text-base font-bold hover:bg-purple-700 transition-colors"
          >
            <PlusCircle className="w-5 h-5" /> Ajouter un magasin
          </button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {stores.map((store) => {
            const firstOpenDay = store.hours.find((hour) => !hour.isClosed);
            return (
              <div key={store.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-52 bg-gray-100 relative">
                  {store.image ? (
                    <img src={store.image} alt={store.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <Building2 className="w-16 h-16" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button onClick={() => startEdit(store)}
                      className="h-9 px-4 rounded-xl bg-white text-blue-600 text-sm font-semibold flex items-center gap-1.5 shadow hover:bg-blue-50 transition-colors">
                      <Edit className="w-4 h-4" /> Modifier
                    </button>
                    <button onClick={() => setToDelete(store.id)}
                      className="w-9 h-9 rounded-xl bg-white text-red-400 flex items-center justify-center shadow hover:bg-red-50 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-extrabold text-gray-900">{store.name}</h2>
                  <p className="text-base text-gray-500 mt-1">{store.address}</p>
                  <p className="text-base text-gray-500">{store.postalCode} {store.city}</p>

                  <div className="grid grid-cols-2 gap-3 mt-5">
                    <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5">
                      <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-700 truncate">{store.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5">
                      <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-700 truncate">{store.email}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5">
                      <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-700">{firstOpenDay ? `${firstOpenDay.open} – ${firstOpenDay.close}` : "Fermé"}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-purple-50 rounded-xl px-3 py-2.5">
                      <Check className="w-4 h-4 text-purple-500 flex-shrink-0" />
                      <span className="text-sm font-bold text-purple-700">Retrait sous {store.clickAndCollectDelay}h</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {store.services.map((service) => (
                      <span key={service} className="text-sm font-semibold bg-green-50 text-green-700 px-3 py-1.5 rounded-lg">
                        {service}
                      </span>
                    ))}
                    {store.hasParking && (
                      <span className="text-sm font-semibold bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                        <Car className="w-3.5 h-3.5" /> Parking
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-950/50" onClick={resetForm} />
          <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col rounded-2xl bg-white shadow-2xl">
            <div className="flex-shrink-0 flex items-start justify-between gap-4 border-b border-gray-100 px-6 py-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-purple-600">
                  {editingId ? "Modification" : "Nouveau point de retrait"}
                </p>
                <h2 className="text-xl font-bold text-gray-900">
                  {editingId ? "Modifier le magasin" : "Ajouter un magasin"}
                </h2>
                <p className="text-sm text-gray-500 mt-1">Les informations renseignées ici sont affichées sur le site public.</p>
              </div>
              <button onClick={resetForm} className="w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
              {error && (
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {error}
                </div>
              )}

              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Identité du magasin</h3>
                    <p className="text-xs text-gray-400">Nom, photo et délai Click & Collect.</p>
                  </div>
                </div>
                <div className="grid lg:grid-cols-[1fr_280px] gap-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-gray-800 mb-1.5">Nom du magasin *</label>
                      <input value={form.name} onChange={setText("name")} autoFocus
                        placeholder="ex: Goprix Paris 12"
                        className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-1.5">Retrait prêt sous</label>
                      <div className="relative">
                        <input value={form.clickAndCollectDelay} onChange={setText("clickAndCollectDelay")} type="number" min="1"
                          className="w-full h-11 px-4 pr-12 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">h</span>
                      </div>
                    </div>
                    <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-purple-50 transition-colors self-end">
                      <input
                        type="checkbox"
                        checked={form.hasParking}
                        onChange={(event) => setForm((current) => ({ ...current, hasParking: event.target.checked }))}
                        className="w-4 h-4 rounded accent-purple-600"
                      />
                      <span className="text-sm font-medium text-gray-800">Parking disponible</span>
                    </label>
                  </div>
                  <ImageUpload
                    label="Photo du magasin"
                    value={form.image}
                    onChange={(url) => setForm((current) => ({ ...current, image: url }))}
                  />
                </div>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-green-50 text-green-700 flex items-center justify-center">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Adresse et contact</h3>
                    <p className="text-xs text-gray-400">Ces informations servent aussi aux boutons appel, e-mail et itinéraire.</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-semibold text-gray-800 mb-1.5">Adresse *</label>
                    <input value={form.address} onChange={setText("address")} placeholder="Numéro et nom de rue"
                      className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1.5">Ville *</label>
                    <input value={form.city} onChange={setText("city")} placeholder="Ville"
                      className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1.5">Code postal *</label>
                    <input value={form.postalCode} onChange={setText("postalCode")} placeholder="75012"
                      className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1.5">Téléphone *</label>
                    <input value={form.phone} onChange={setText("phone")} placeholder="01 00 00 00 00"
                      className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1.5">Email *</label>
                    <input value={form.email} onChange={setText("email")} type="email" placeholder="magasin@goprix.fr"
                      className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1.5">Latitude</label>
                    <input value={form.lat} onChange={setText("lat")} placeholder="optionnel"
                      className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1.5">Longitude</label>
                    <input value={form.lng} onChange={setText("lng")} placeholder="optionnel"
                      className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" />
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">Horaires d&apos;ouverture</h3>
                    <p className="text-xs text-gray-400">Cochez “fermé” pour masquer les heures d&apos;un jour.</p>
                  </div>
                </div>
                <div className="rounded-2xl border border-gray-100 overflow-hidden">
                  {form.hours.map((hour, index) => (
                    <div key={hour.day} className="grid grid-cols-[1fr_auto] sm:grid-cols-[150px_1fr_auto] gap-3 items-center px-4 py-3 border-b border-gray-50 last:border-b-0">
                      <p className="text-sm font-semibold text-gray-800">{hour.day}</p>
                      <div className="col-span-2 sm:col-span-1 grid grid-cols-2 gap-2">
                        <input
                          type="time"
                          value={hour.open}
                          disabled={hour.isClosed}
                          onChange={(event) => updateHour(index, { open: event.target.value })}
                          className="h-10 px-3 rounded-xl border border-gray-200 text-sm disabled:bg-gray-50 disabled:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-200"
                        />
                        <input
                          type="time"
                          value={hour.close}
                          disabled={hour.isClosed}
                          onChange={(event) => updateHour(index, { close: event.target.value })}
                          className="h-10 px-3 rounded-xl border border-gray-200 text-sm disabled:bg-gray-50 disabled:text-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-200"
                        />
                      </div>
                      <label className="flex items-center gap-2 text-xs font-semibold text-gray-500 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={hour.isClosed}
                          onChange={(event) => updateHour(index, { isClosed: event.target.checked })}
                          className="w-4 h-4 rounded accent-purple-600"
                        />
                        Fermé
                      </label>
                    </div>
                  ))}
                </div>
              </section>

              <section className="grid lg:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-xl bg-green-50 text-green-700 flex items-center justify-center">
                      <Check className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900">Services disponibles</h3>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {serviceOptions.map((service) => (
                      <label key={service} className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm cursor-pointer transition-colors ${
                        form.services.includes(service) ? "border-green-200 bg-green-50 text-green-800" : "border-gray-100 text-gray-600 hover:bg-gray-50"
                      }`}>
                        <input
                          type="checkbox"
                          checked={form.services.includes(service)}
                          onChange={() => toggleListValue("services", service)}
                          className="w-4 h-4 rounded accent-green-600"
                        />
                        {service}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900">Moyens de paiement</h3>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {paymentOptions.map((payment) => (
                      <label key={payment} className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm cursor-pointer transition-colors ${
                        form.paymentMethods.includes(payment) ? "border-purple-200 bg-purple-50 text-purple-800" : "border-gray-100 text-gray-600 hover:bg-gray-50"
                      }`}>
                        <input
                          type="checkbox"
                          checked={form.paymentMethods.includes(payment)}
                          onChange={() => toggleListValue("paymentMethods", payment)}
                          className="w-4 h-4 rounded accent-purple-600"
                        />
                        {payment}
                      </label>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            <div className="flex-shrink-0 flex flex-col-reverse gap-3 border-t border-gray-100 px-6 py-4 sm:flex-row sm:justify-end">
              <button onClick={resetForm}
                className="h-11 px-5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                Annuler
              </button>
              <button onClick={handleSave}
                className="h-11 px-6 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                {editingId ? "Enregistrer" : "Ajouter le magasin"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!toDelete}
        title="Supprimer le magasin"
        message="Ce magasin sera retiré du site public et du choix de retrait."
        confirmLabel="Supprimer"
        onConfirm={() => {
          if (toDelete) {
            deleteStore(toDelete);
            if (selectedStore?.id === toDelete) clearSelection();
            setToDelete(null);
          }
        }}
        onCancel={() => setToDelete(null)}
        danger
      />
    </div>
  );
}
