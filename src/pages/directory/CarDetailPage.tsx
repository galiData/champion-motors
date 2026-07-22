import { CarFront, Gauge, MapPin, Wallet } from "lucide-react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DetailLayout } from "@/components/features/directory/DetailLayout";
import { Badge } from "@/components/ui/badge";
import { useCar } from "@/hooks/useCar";
import { useLocationNames } from "@/hooks/useLocationNames";
import { CAR_STATUS_LABELS } from "@/types/car";
import { MARQUE_LABELS } from "@/types/marque";
import { formatCurrency, formatNumber } from "@/utils/formatCurrency";

const STATUS_TONE = {
  "in-stock": "positive",
  reserved: "info",
  delivered: "neutral",
  "in-service": "muted",
} as const;

export function CarDetailPage() {
  const { id } = useParams<{ id: string }>();
  const state = useCar(id);
  const locationNames = useLocationNames();

  return (
    <DetailLayout
      state={state}
      backTo="/cars"
      backLabel="חזרה לרשימת הרכבים"
      title={(car) => `${MARQUE_LABELS[car.marque]} ${car.model}`}
      subtitle={(car) => (
        <span className="flex flex-wrap items-center gap-3">
          <span dir="ltr">{car.trim}</span>
          <Badge tone="info">{CAR_STATUS_LABELS[car.status]}</Badge>
        </span>
      )}
      notFoundTitle="הרכב לא נמצא"
      notFoundDescription="ייתכן שהרכב הוסר מהמלאי או שהקישור שגוי."
      fields={(car) => [
        { label: "יצרן", value: <span dir="ltr">{MARQUE_LABELS[car.marque]}</span> },
        { label: "דגם", value: <span dir="ltr">{car.model}</span> },
        { label: "רמת גימור", value: <span dir="ltr">{car.trim}</span> },
        { label: "שנת ייצור", value: <span className="ltr-nums">{car.year}</span> },
        { label: "מספר רישוי", value: <span className="ltr-nums">{car.licensePlate}</span> },
        { label: "מספר שלדה", value: <span className="ltr-nums">{car.vin}</span> },
        { label: "סטטוס", value: CAR_STATUS_LABELS[car.status] },
        { label: "סניף", value: locationNames.get(car.locationId) ?? "—" },
        {
          label: "קילומטראז'",
          value: <span className="ltr-nums">{formatNumber(car.mileageKm)} ק״מ</span>,
        },
        {
          label: "מחיר מחירון",
          value: <span className="ltr-nums font-semibold">{formatCurrency(car.listPriceIls)}</span>,
        },
      ]}
      children={(car) => (
        <section className="grid gap-6 lg:grid-cols-2" aria-label="תצוגת רכב">
          <Card className="overflow-hidden border-cm-line p-0">
            <CardContent className="relative isolate min-h-72 bg-gradient-to-b from-cm-navy to-cm-deep-blue p-8 text-white">
              <div className="absolute -end-12 -top-12 size-48 rounded-full bg-cm-sky/20" aria-hidden="true" />
              <div className="absolute -bottom-14 start-8 size-56 rounded-full bg-cm-blue/25" aria-hidden="true" />

              <div className="relative z-10 flex h-full flex-col justify-between gap-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-cm-sky">דמו ויזואלי לרכב</p>
                    <h2 className="text-3xl font-bold leading-tight text-white">
                      <span dir="ltr">
                        {MARQUE_LABELS[car.marque]} {car.model}
                      </span>
                    </h2>
                    <p className="text-base text-cm-paper" dir="ltr">
                      {car.trim}
                    </p>
                  </div>
                  <Badge tone={STATUS_TONE[car.status]}>{CAR_STATUS_LABELS[car.status]}</Badge>
                </div>

                <div className="rounded-lg border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
                  <div className="mb-3 flex items-center gap-3">
                    <CarFront className="size-6 text-cm-sky" aria-hidden="true" />
                    <p className="text-lg font-semibold text-white">תצוגת אולם ומסירת מידע</p>
                  </div>
                  <p className="text-sm leading-7 text-cm-paper">
                    התאמה מהירה לנציג מכירות: סטטוס מלאי, מחיר עדכני ופרטי זיהוי במקום אחד להצגת
                    הדגם ללקוח.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="bg-cm-paper">
              <CardHeader>
                <CardDescription>מחיר מחירון</CardDescription>
                <CardTitle className="text-3xl leading-none text-cm-ink">
                  <span className="ltr-nums">{formatCurrency(car.listPriceIls)}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-cm-slate">
                נתון בסיסי להצעת רכישה והשוואת גרסאות.
              </CardContent>
            </Card>

            <Card className="bg-cm-paper">
              <CardHeader>
                <CardDescription>קילומטראז׳</CardDescription>
                <CardTitle className="text-3xl leading-none text-cm-ink">
                  <span className="ltr-nums">{formatNumber(car.mileageKm)}</span> ק״מ
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-cm-slate">עוזר לתאם ציפיות לפני נסיעת מבחן.</CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardDescription>מיקום וסטטוס תפעולי</CardDescription>
                <CardTitle className="text-xl text-cm-deep-blue">
                  {locationNames.get(car.locationId) ?? "—"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-cm-graphite">
                <p className="flex items-center gap-2">
                  <MapPin className="size-4 text-cm-blue" aria-hidden="true" />
                  סניף פעיל להצגה ולקליטה.
                </p>
                <p className="flex items-center gap-2">
                  <Gauge className="size-4 text-cm-blue" aria-hidden="true" />
                  שנת ייצור: <span className="ltr-nums">{car.year}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Wallet className="size-4 text-cm-blue" aria-hidden="true" />
                  מספר רישוי: <span className="ltr-nums">{car.licensePlate}</span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardDescription>הצעת פעולה לנציג</CardDescription>
                <CardTitle className="text-xl text-cm-deep-blue">הדגמה ללקוח</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-cm-graphite">
                <p>1. הצגת אבזור עיקרי לפי רמת גימור.</p>
                <p>2. בדיקת זמינות מיידית לפי סטטוס.</p>
                <p>3. מעבר מהיר להצעת מחיר.</p>
              </CardContent>
            </Card>
          </div>
        </section>
      )}
    />
  );
}
