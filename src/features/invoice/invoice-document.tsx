import { Document, G, Page, Path, StyleSheet, Svg, Text, View } from '@react-pdf/renderer';
import {
  EMBLEM_PATHS,
  EMBLEM_STROKE_SMALL,
  EMBLEM_VIEWBOX,
} from '@/components/layout/emblem-paths';
import { siteConfig } from '@/config/site';
import { formatUSD } from '@/lib/money';
import type { Order } from '@/lib/schemas/order';
import { colors } from '@/styles/tokens';

/**
 * Comprobante de pedido (NO fiscal) en PDF.
 * Fondo blanco para que se pueda imprimir; la marca aparece en los acentos dorado y rojo.
 * Usa Helvetica (fuente estándar del PDF): cubre acentos y ñ sin incrustar fuentes.
 */
const INK = '#111113';
const MUTED = '#5c5c66';
const LINE = '#e4e4e7';
const GOLD_TEXT = '#8a6d12'; // dorado oscurecido: legible sobre blanco (el #D4AF37 no lo es)

const s = StyleSheet.create({
  page: {
    paddingTop: 0,
    paddingBottom: 48,
    paddingHorizontal: 40,
    fontFamily: 'Helvetica',
    fontSize: 9.5,
    color: INK,
  },
  topBar: { height: 6, backgroundColor: colors.red, marginHorizontal: -40, marginBottom: 28 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandName: { fontFamily: 'Helvetica-Bold', fontSize: 18, letterSpacing: 2 },
  slogan: { fontFamily: 'Helvetica-Oblique', fontSize: 10, color: GOLD_TEXT, marginTop: 2 },
  docTitle: { fontFamily: 'Helvetica-Bold', fontSize: 11, letterSpacing: 1.5, textAlign: 'right' },
  docMeta: { fontSize: 9, color: MUTED, textAlign: 'right', marginTop: 3 },
  orderNumber: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 12,
    color: GOLD_TEXT,
    textAlign: 'right',
    marginTop: 4,
  },
  goldRule: { height: 1.5, backgroundColor: colors.gold, marginVertical: 18 },
  columns: { flexDirection: 'row', gap: 20 },
  box: { borderWidth: 1, borderColor: LINE, borderRadius: 4, padding: 12 },
  column: { flex: 1 },
  boxTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 8,
    letterSpacing: 1.5,
    color: GOLD_TEXT,
    marginBottom: 6,
  },
  row: { flexDirection: 'row', marginBottom: 2.5 },
  label: { width: 70, color: MUTED },
  value: { flex: 1 },
  table: { marginTop: 20 },
  th: {
    flexDirection: 'row',
    backgroundColor: INK,
    color: '#ffffff',
    fontFamily: 'Helvetica-Bold',
    fontSize: 8,
    letterSpacing: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tr: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: LINE,
    paddingVertical: 7,
    paddingHorizontal: 8,
  },
  cNum: { width: 20 },
  cName: { flex: 1 },
  cSize: { width: 40, textAlign: 'center' },
  cQty: { width: 40, textAlign: 'center' },
  cUnit: { width: 64, textAlign: 'right' },
  cTotal: { width: 70, textAlign: 'right' },
  itemName: { fontFamily: 'Helvetica-Bold' },
  itemMeta: { fontSize: 8, color: MUTED, marginTop: 1 },
  totals: { marginTop: 14, marginLeft: 'auto', width: 230 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  discount: { color: '#15803d' },
  grandTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: colors.gold,
    fontFamily: 'Helvetica-Bold',
    fontSize: 12,
  },
  notes: { marginTop: 18, padding: 10, backgroundColor: '#f7f7f8', borderRadius: 4 },
  footer: {
    position: 'absolute',
    bottom: 22,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: LINE,
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 7.5,
    color: MUTED,
  },
  legal: {
    marginTop: 22,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.red,
    borderRadius: 4,
    color: colors['red-deep'],
    fontSize: 8.5,
  },
  legalTitle: { fontFamily: 'Helvetica-Bold', marginBottom: 2 },
});

function Emblem() {
  return (
    <Svg width={26} height={31} viewBox={EMBLEM_VIEWBOX}>
      <G
        stroke={colors.gold}
        strokeWidth={EMBLEM_STROKE_SMALL}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        {EMBLEM_PATHS.map((d) => (
          <Path key={d} d={d} />
        ))}
      </G>
    </Svg>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.row}>
      <Text style={s.label}>{label}</Text>
      <Text style={s.value}>{value}</Text>
    </View>
  );
}

export function formatOrderDate(iso: string): string {
  return new Intl.DateTimeFormat('es-VE', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'America/Caracas',
  }).format(new Date(iso));
}

export function InvoiceDocument({ order }: { order: Order }) {
  const { customer: c, totals } = order;
  const pct = Math.round(totals.discountRate * 100);

  return (
    <Document
      title={`Comprobante ${order.number}`}
      author={siteConfig.name}
      subject="Comprobante de pedido"
      language="es"
    >
      <Page size="A4" style={s.page}>
        <View style={s.topBar} fixed />

        <View style={s.header}>
          <View style={s.brand}>
            <Emblem />
            <View>
              <Text style={s.brandName}>{siteConfig.name.toUpperCase()}</Text>
              <Text style={s.slogan}>{siteConfig.slogan}</Text>
            </View>
          </View>
          <View>
            <Text style={s.docTitle}>COMPROBANTE DE PEDIDO</Text>
            <Text style={s.orderNumber}>{order.number}</Text>
            <Text style={s.docMeta}>{formatOrderDate(order.createdAt)}</Text>
          </View>
        </View>

        <View style={s.goldRule} />

        <View style={s.columns}>
          <View style={[s.box, s.column]}>
            <Text style={s.boxTitle}>TIENDA</Text>
            <Text style={s.itemName}>{siteConfig.name}</Text>
            <Text>
              {siteConfig.location.city}, {siteConfig.location.state}, {siteConfig.location.country}
            </Text>
            <Text>WhatsApp: {siteConfig.contact.whatsappDisplay}</Text>
            <Text>{siteConfig.contact.email}</Text>
          </View>
          <View style={[s.box, s.column]}>
            <Text style={s.boxTitle}>CLIENTE</Text>
            <Field label="Nombre" value={c.name} />
            <Field label="Cédula/RIF" value={c.idNumber} />
            <Field label="Teléfono" value={c.phone} />
            {c.email ? <Field label="Correo" value={c.email} /> : null}
          </View>
        </View>

        <View style={[s.box, { marginTop: 12 }]}>
          <Text style={s.boxTitle}>ENVÍO Y PAGO</Text>
          <Field label="Dirección" value={`${c.address}, ${c.city}, ${c.state}`} />
          <Field label="Envío" value={c.shippingAgency} />
          <Field label="Pago" value={c.paymentMethod} />
        </View>

        <View style={s.table}>
          <View style={s.th} fixed>
            <Text style={s.cNum}>#</Text>
            <Text style={s.cName}>PRODUCTO</Text>
            <Text style={s.cSize}>TALLA</Text>
            <Text style={s.cQty}>CANT.</Text>
            <Text style={s.cUnit}>P. UNIT.</Text>
            <Text style={s.cTotal}>TOTAL</Text>
          </View>
          {order.items.map((item, i) => (
            <View
              key={`${item.productId}-${item.colorName}-${item.size}`}
              style={s.tr}
              wrap={false}
            >
              <Text style={s.cNum}>{i + 1}</Text>
              <View style={s.cName}>
                <Text style={s.itemName}>{item.name}</Text>
                <Text style={s.itemMeta}>
                  Colección {item.collectionName} · Color {item.colorName}
                </Text>
              </View>
              <Text style={s.cSize}>{item.size}</Text>
              <Text style={s.cQty}>{item.qty}</Text>
              <Text style={s.cUnit}>{formatUSD(item.unitPriceCents)}</Text>
              <Text style={s.cTotal}>{formatUSD(item.lineTotalCents)}</Text>
            </View>
          ))}
        </View>

        <View style={s.totals} wrap={false}>
          <View style={s.totalRow}>
            <Text>
              Subtotal ({totals.itemCount} {totals.itemCount === 1 ? 'prenda' : 'prendas'})
            </Text>
            <Text>{formatUSD(totals.subtotalCents)}</Text>
          </View>
          {totals.isWholesale ? (
            <View style={[s.totalRow, s.discount]}>
              <Text>Descuento al mayor ({pct}%)</Text>
              <Text>-{formatUSD(totals.discountCents)}</Text>
            </View>
          ) : null}
          <View style={s.grandTotal}>
            <Text>TOTAL A PAGAR</Text>
            <Text>{formatUSD(totals.totalCents)} USD</Text>
          </View>
        </View>

        {c.notes ? (
          <View style={s.notes} wrap={false}>
            <Text style={s.boxTitle}>NOTAS DEL CLIENTE</Text>
            <Text>{c.notes}</Text>
          </View>
        ) : null}

        <View style={s.legal} wrap={false}>
          <Text style={s.legalTitle}>Comprobante de pedido. No válido como factura fiscal.</Text>
          <Text>
            El pedido se confirma al verificar el pago por WhatsApp (
            {siteConfig.contact.whatsappDisplay}). La factura fiscal se emite por separado.
          </Text>
        </View>

        <View style={s.footer} fixed>
          <Text>
            {siteConfig.name} · {siteConfig.slogan}
          </Text>
          <Text render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}
