import React from 'react'
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer'
import { Material, Project } from '@/types'
import { formatDate } from '@/utils/functions'

// Simple interface for company info
interface CompanyInfo {
  createdBy: string;
  otherInfo?: string;
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    backgroundColor: '#F8F8F8',
  },
  text: {
    fontSize: 11,
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 64,
    height: 64,
  },
  companyDetails: {
    display: 'flex',
    width: '100%',
    justifyContent: 'space-between',
    marginLeft: 10,
    fontSize: 10,
    color: '#666',
  },
  companyName: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  clientDetails: {
    backgroundColor: '#f0f9f0',
    padding: 10,
    marginBottom: 20,
    borderRadius: 10,
  },
  section: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  table: {
    width: '100%',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '15%',
    padding: 10,
    fontWeight: 300,
    paddingBottom: 20,
  },
  tableCol: {
    width: '15%',
    padding: 10,
  },
  footer: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    padding: 10,
  },
  subtotal: {
    fontSize: 14,
    fontWeight: 'bold',
  },
})


Font.registerEmojiSource({
  format: 'png',
  url: 'https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/',
});

const calculateTotalPrice = (quantity: number, rate: number) => Number(quantity) * Number(rate)
const calculateSubtotal = (materials: Material[] | undefined) =>
  materials?.reduce(
    (subtotal, material) => subtotal + calculateTotalPrice(material.quantity, material.price),
    0
  )

export const ProjectPDFDocument: React.FC<{
  project: Project | null;
  companyInfo: CompanyInfo;
}> = ({ project, companyInfo }) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image style={styles.logo} src="/images/viva-logo.png" />
        </View>
        <View style={{ marginRight: 5, textAlign: 'right', width: '30%' }}>
          <Text style={{ fontWeight: 600, fontSize: 14 }}>Created By</Text>
          <Text style={{ fontWeight: 300 }}>{companyInfo.createdBy}</Text>
          {companyInfo.otherInfo && (
            <Text style={{ fontWeight: 300, fontSize: 11, }}>{companyInfo.otherInfo}</Text>
          )}
        </View>
      </View>
      <View style={styles.clientDetails}>
        <View>
          <Text style={styles.subtitle}>Client Details</Text>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              <Text style={{ ...styles.text, fontWeight: 300 }}>{project?.clientName}</Text>
              <Text style={{ ...styles.text, fontWeight: 300 }}>
                Landscaping for the Virtual Office
              </Text>
            </View>
            <View style={{ textAlign: 'right', width: '50%' }}>
              <Text style={styles.text}>Submitted On: {formatDate(project?.startDate)}</Text>
              <Text style={styles.text}>Due Date: {formatDate(project?.dueDate)}</Text>
            </View>
          </View>
        </View>
      </View>
      {project?.notes && (
        <View style={{ ...styles.section, backgroundColor: '#f0f9f0', marginBottom: 20 }}>
          <Text style={styles.subtitle}>Project Notes</Text>
          {
            project.notes.map((note, index) => (
              <View key={index} style={{ flexDirection: 'row', marginBottom: 4, paddingRight: 10 }}>
                <Text style={{ ...styles.text, marginRight: 5 }}>•</Text>
                <Text style={styles.text}>
                  {typeof note === 'object' && note.content
                    ? note.content
                    : String(note)}
                </Text>
              </View>
            ))}
        </View>
      )}

      <View style={styles.section}>
        <View style={styles.table}>
          <View style={{ ...styles.tableRow, borderBottom: '1px solid #DDD' }}>
            <Text style={{ ...styles.tableColHeader, width: '50%' }}>Material</Text>
            <Text style={styles.tableColHeader}>Qty</Text>
            <Text style={styles.tableColHeader}>Rate</Text>
            <Text style={{ ...styles.tableColHeader, textAlign: 'right', width: '20%' }}>Total Price</Text>
          </View>
          {project?.materials?.map((material, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={{ ...styles.tableCol, width: '50%' }}>{material.name}</Text>
              <Text style={styles.tableCol}>{material.quantity}</Text>
              <Text style={styles.tableCol}>{`$${Number(material.price).toFixed(2)}`}</Text>
              <Text
                style={{ ...styles.tableCol, textAlign: 'right', width: '20%' }}
              >{`$${calculateTotalPrice(material.quantity, material.price).toFixed(2)}`}</Text>
            </View>
          ))}
        </View>
        <View style={styles.footer}>
          <Text style={styles.subtotal}>SUBTOTAL</Text>
          <Text style={styles.subtotal}>${calculateSubtotal(project?.materials)?.toFixed(2)}</Text>
        </View>
      </View>
    </Page>
  </Document>
)
