import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

import type { InvoiceData } from "@/types/invoice";
import {
  formatCurrency,
  formatDate,
  formatServicePeriod,
  numberToWords,
} from "@/utils/invoice/formatInvoice";

interface InvoicePDFProps {
  data: InvoiceData;
}

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#0f172a",
    backgroundColor: "#ffffff",
  },

  /* =====================================================
     HEADER
  ===================================================== */

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#cbd5e1",
  },

  companySection: {
    flexDirection: "row",
    alignItems: "center",
  },

  logoBox: {
    width: 42,
    height: 42,
    backgroundColor: "#020617",
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  logoText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },

  companyName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#020617",
  },

  companySubtitle: {
    marginTop: 4,
    fontSize: 9,
    color: "#475569",
  },

  invoiceSection: {
    alignItems: "flex-end",
  },

  invoiceLabel: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#64748b",
    letterSpacing: 2,
    textTransform: "uppercase",
  },

  invoiceNumber: {
    marginTop: 4,
    fontSize: 19,
    fontWeight: "bold",
    color: "#020617",
  },

  status: {
    marginTop: 8,
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 12,
  },

  statusPaid: {
    backgroundColor: "#dcfce7",
    borderWidth: 1,
    borderColor: "#86efac",
  },

  statusPending: {
    backgroundColor: "#fef3c7",
    borderWidth: 1,
    borderColor: "#fcd34d",
  },

  statusText: {
    fontSize: 8,
    fontWeight: "bold",
  },

  statusPaidText: {
    color: "#047857",
  },

  statusPendingText: {
    color: "#b45309",
  },

  /* =====================================================
     INVOICE INFORMATION
  ===================================================== */

  infoBar: {
    flexDirection: "row",
    backgroundColor: "#f8fafc",
    padding: 14,
    marginTop: 18,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 7,
  },

  infoItem: {
    flex: 1,
  },

  infoLabel: {
    fontSize: 7,
    fontWeight: "bold",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  infoValue: {
    marginTop: 5,
    fontSize: 10,
    fontWeight: "bold",
    color: "#020617",
  },

  importantInfoValue: {
    marginTop: 5,
    fontSize: 11,
    fontWeight: "bold",
    color: "#020617",
  },

  /* =====================================================
     BILL TO
  ===================================================== */

  billTo: {
    marginTop: 18,
    padding: 14,
    borderWidth: 2,
    borderColor: "#cbd5e1",
    borderRadius: 7,
  },

  sectionLabel: {
    fontSize: 7,
    fontWeight: "bold",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },

  clientName: {
    marginTop: 5,
    fontSize: 15,
    fontWeight: "bold",
    color: "#020617",
  },

  /* =====================================================
     SERVICES TABLE
  ===================================================== */

  table: {
    marginTop: 18,
    borderWidth: 2,
    borderColor: "#cbd5e1",
    borderRadius: 7,
    overflow: "hidden",
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#020617",
    paddingVertical: 11,
    paddingHorizontal: 12,
  },

  descriptionHeader: {
    flex: 1,
    fontSize: 8,
    fontWeight: "bold",
    color: "#ffffff",
    textTransform: "uppercase",
  },

  quantityHeader: {
    width: 75,
    textAlign: "center",
    fontSize: 8,
    fontWeight: "bold",
    color: "#ffffff",
    textTransform: "uppercase",
  },

  amountHeader: {
    width: 90,
    textAlign: "right",
    fontSize: 8,
    fontWeight: "bold",
    color: "#ffffff",
    textTransform: "uppercase",
  },

  tableRow: {
    flexDirection: "row",
    padding: 12,
    minHeight: 68,
  },

  descriptionCell: {
    flex: 1,
  },

  description: {
    fontSize: 10,
    fontWeight: "bold",
    lineHeight: 1.4,
    color: "#020617",
  },

  servicePeriod: {
    marginTop: 6,
    fontSize: 8,
    color: "#475569",
    lineHeight: 1.4,
  },

  quantityCell: {
    width: 75,
    textAlign: "center",
    fontSize: 9,
    fontWeight: "bold",
    color: "#334155",
  },

  amountCell: {
    width: 90,
    textAlign: "right",
    fontSize: 10,
    fontWeight: "bold",
    color: "#020617",
  },

  /* =====================================================
     TOTALS
  ===================================================== */

  totals: {
    marginTop: 16,
    marginLeft: "auto",
    width: 220,
  },

  subtotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#cbd5e1",
  },

  subtotalLabel: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#64748b",
  },

  subtotalValue: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#0f172a",
  },

  /* Important total box */

  total: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#020617",
    borderRadius: 7,
  },

  totalLabel: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#ffffff",
    textTransform: "uppercase",
  },

  totalValue: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#ffffff",
  },

  /* =====================================================
     AMOUNT IN WORDS
  ===================================================== */

  amountWords: {
    marginTop: 16,
    padding: 11,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 7,
  },

  amountWordsText: {
    marginTop: 4,
    fontSize: 9,
    fontWeight: "bold",
    lineHeight: 1.5,
    color: "#1e293b",
  },

  /* =====================================================
     PAYMENT DETAILS
  ===================================================== */

  paymentDetails: {
    marginTop: 17,
    borderWidth: 2,
    borderColor: "#94a3b8",
    borderRadius: 8,
    overflow: "hidden",
  },

  paymentHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#020617",
    paddingHorizontal: 13,
    paddingVertical: 11,
  },

  paymentHeaderIcon: {
    width: 24,
    height: 24,
    borderRadius: 5,
    backgroundColor: "#334155",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  paymentHeaderIconText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "bold",
  },

  paymentHeaderText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#ffffff",
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  paymentHeaderSubtext: {
    marginTop: 2,
    fontSize: 7,
    color: "#cbd5e1",
  },

  paymentGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 12,
  },

  paymentItem: {
    width: "50%",
    paddingRight: 10,
    marginBottom: 10,
  },

  paymentLabel: {
    fontSize: 7,
    fontWeight: "bold",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },

  paymentValue: {
    marginTop: 3,
    fontSize: 10,
    fontWeight: "bold",
    color: "#020617",
  },

  paymentImportantItem: {
    width: "50%",
    padding: 8,
    paddingLeft: 0,
    marginBottom: 2,
  },

  paymentImportantLabel: {
    fontSize: 7,
    fontWeight: "bold",
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },

  paymentImportantValue: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: "bold",
    color: "#020617",
    fontFamily: "Courier",
  },

  paymentNotice: {
    borderTopWidth: 1,
    borderTopColor: "#cbd5e1",
    backgroundColor: "#f8fafc",
    paddingHorizontal: 12,
    paddingVertical: 7,
  },

  paymentNoticeText: {
    fontSize: 7.5,
    fontWeight: "bold",
    color: "#475569",
  },

  /* =====================================================
     NOTES
  ===================================================== */

  notes: {
    marginTop: 16,
  },

  notesText: {
    marginTop: 5,
    fontSize: 9,
    lineHeight: 1.5,
    color: "#475569",
  },

  /* =====================================================
     FOOTER
  ===================================================== */

  footer: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 2,
    borderTopColor: "#cbd5e1",
    alignItems: "center",
  },

  thankYou: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#334155",
  },

  preparedBy: {
    marginTop: 5,
    fontSize: 8,
    color: "#64748b",
  },
});

export default function InvoicePDF({ data }: InvoicePDFProps) {
  const isPaid = data.paymentStatus === "PAID";

  const hasBankDetails =
    Boolean(data.bankName.trim()) ||
    Boolean(data.accountTitle.trim()) ||
    Boolean(data.accountNumber.trim()) ||
    Boolean(data.iban.trim());

  return (
    <Document
      title={`Invoice ${data.invoiceNumber}`}
      author="TJNex Technologies"
      subject="Technical Support & Maintenance Invoice"
    >
      <Page size="A4" style={styles.page}>
        {/* =====================================================
            HEADER
        ===================================================== */}
        <View style={styles.header}>
          <View style={styles.companySection}>
            <View style={styles.logoBox}>
              <Text style={styles.logoText}>T</Text>
            </View>

            <View>
              <Text style={styles.companyName}>TJNex Technologies</Text>

              <Text style={styles.companySubtitle}>
                Technical Support & Software Services
              </Text>
            </View>
          </View>

          <View style={styles.invoiceSection}>
            <Text style={styles.invoiceLabel}>Invoice</Text>

            <Text style={styles.invoiceNumber}>{data.invoiceNumber}</Text>

            <View
              style={[
                styles.status,
                isPaid ? styles.statusPaid : styles.statusPending,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  isPaid ? styles.statusPaidText : styles.statusPendingText,
                ]}
              >
                {isPaid ? "PAID" : "PENDING"}
              </Text>
            </View>
          </View>
        </View>

        {/* =====================================================
            INVOICE INFORMATION
        ===================================================== */}
        <View style={styles.infoBar}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Invoice Date</Text>

            <Text style={styles.infoValue}>{formatDate(data.invoiceDate)}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Service Period</Text>

            <Text style={styles.infoValue}>
              {formatServicePeriod(data.serviceFrom, data.serviceTo)}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Due Date</Text>

            <Text style={styles.importantInfoValue}>
              {formatDate(data.dueDate)}
            </Text>
          </View>
        </View>

        {/* =====================================================
            BILL TO
        ===================================================== */}
        <View style={styles.billTo}>
          <Text style={styles.sectionLabel}>Bill To</Text>

          <Text style={styles.clientName}>{data.clientName}</Text>
        </View>

        {/* =====================================================
            SERVICES
        ===================================================== */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.descriptionHeader}>Description</Text>

            <Text style={styles.quantityHeader}>Quantity</Text>

            <Text style={styles.amountHeader}>Amount</Text>
          </View>

          <View style={styles.tableRow}>
            <View style={styles.descriptionCell}>
              <Text style={styles.description}>{data.description}</Text>

              <Text style={styles.servicePeriod}>
                Service period:{" "}
                {formatServicePeriod(data.serviceFrom, data.serviceTo)}
              </Text>
            </View>

            <Text style={styles.quantityCell}>1 Month</Text>

            <Text style={styles.amountCell}>{formatCurrency(data.amount)}</Text>
          </View>
        </View>

        {/* =====================================================
            TOTALS
        ===================================================== */}
        <View style={styles.totals}>
          <View style={styles.subtotal}>
            <Text style={styles.subtotalLabel}>Subtotal</Text>

            <Text style={styles.subtotalValue}>
              {formatCurrency(data.amount)}
            </Text>
          </View>

          <View style={styles.total}>
            <Text style={styles.totalLabel}>Total Due</Text>

            <Text style={styles.totalValue}>{formatCurrency(data.amount)}</Text>
          </View>
        </View>

        {/* =====================================================
            AMOUNT IN WORDS
        ===================================================== */}
        <View style={styles.amountWords}>
          <Text style={styles.sectionLabel}>Amount in Words</Text>

          <Text style={styles.amountWordsText}>
            {numberToWords(data.amount)}
          </Text>
        </View>

        {/* =====================================================
            PAYMENT DETAILS
        ===================================================== */}
        {hasBankDetails && (
          <View style={styles.paymentDetails}>
            {/* Header */}
            <View style={styles.paymentHeader}>
              <View style={styles.paymentHeaderIcon}>
                <Text style={styles.paymentHeaderIconText}>$</Text>
              </View>

              <View>
                <Text style={styles.paymentHeaderText}>Payment Details</Text>

                <Text style={styles.paymentHeaderSubtext}>
                  Bank transfer information
                </Text>
              </View>
            </View>

            {/* Details */}
            <View style={styles.paymentGrid}>
              {data.bankName.trim() && (
                <View style={styles.paymentItem}>
                  <Text style={styles.paymentLabel}>Bank Name</Text>

                  <Text style={styles.paymentValue}>{data.bankName}</Text>
                </View>
              )}

              {data.accountTitle.trim() && (
                <View style={styles.paymentItem}>
                  <Text style={styles.paymentLabel}>Account Title</Text>

                  <Text style={styles.paymentValue}>{data.accountTitle}</Text>
                </View>
              )}

              {data.accountNumber.trim() && (
                <View style={styles.paymentImportantItem}>
                  <Text style={styles.paymentImportantLabel}>
                    Account Number
                  </Text>

                  <Text style={styles.paymentImportantValue}>
                    {data.accountNumber}
                  </Text>
                </View>
              )}

              {data.iban.trim() && (
                <View style={styles.paymentImportantItem}>
                  <Text style={styles.paymentImportantLabel}>IBAN</Text>

                  <Text style={styles.paymentImportantValue}>{data.iban}</Text>
                </View>
              )}
            </View>

            {/* Notice */}
            <View style={styles.paymentNotice}>
              <Text style={styles.paymentNoticeText}>
                Please use the account details above when making your payment.
              </Text>
            </View>
          </View>
        )}

        {/* =====================================================
            NOTES
        ===================================================== */}
        {data.notes.trim() && (
          <View style={styles.notes}>
            <Text style={styles.sectionLabel}>Notes</Text>

            <Text style={styles.notesText}>{data.notes}</Text>
          </View>
        )}

        {/* =====================================================
            FOOTER
        ===================================================== */}
        <View style={styles.footer}>
          <Text style={styles.thankYou}>Thank you for your business.</Text>

          {data.preparedBy.trim() && (
            <Text style={styles.preparedBy}>
              Prepared by: {data.preparedBy}
            </Text>
          )}
        </View>
      </Page>
    </Document>
  );
}
