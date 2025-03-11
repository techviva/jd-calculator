import React from 'react'
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import { Material, Project } from '@/types'
import { formatDate } from '@/utils/functions'

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    backgroundColor: "#F8F8F8",
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
    width: "100%",
    justifyContent: "space-between",
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
    backgroundColor: "white",
    borderRadius: 10,
  },
  table: {
    width: '100%',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '25%',
    padding: 10,
    fontWeight: 300,
    paddingBottom: 20
  },
  tableCol: {
    width: '25%',
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

const calculateTotalPrice = (quantity: number, rate: number) => quantity * rate
const calculateSubtotal = (materials: Material[] | undefined) =>
  materials?.reduce(
    (subtotal, material) => subtotal + calculateTotalPrice(material.quantity, material.price),
    0
  )

export const ProjectPDFDocument: React.FC<{ project: Project | null }> = ({ project }) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            src='/images/viva-logo.png'
          />
        </View>
        <View style={{ marginRight: 5, textAlign: 'right', width: '50%' }}>
          <Text style={{ fontWeight: 300 }}>Glendale, AZ</Text>
          <Text style={{ fontWeight: 300 }}>United States, Arizona</Text>
          <Text style={{ fontWeight: 300 }}>+1 623-221-3825</Text>
        </View>
      </View>
      <View style={styles.clientDetails}>
        <View>
          <Text style={styles.subtitle}>Client Details</Text>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              <Text style={{ ...styles.text, fontWeight: 300 }}>{project?.clientName}</Text>
              <Text style={{ ...styles.text, fontWeight: 300 }}>Landscaping for the Virtual Office</Text>
            </View>
            <View style={{ textAlign: 'right', width: '50%' }}>
              <Text style={styles.text}>Submitted On: {formatDate(project?.startDate)}</Text>
              <Text style={styles.text}>Due Date: {formatDate(project?.dueDate)}</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.section}>
        <View style={styles.table}>
          <View style={{ ...styles.tableRow, borderBottom: "1px solid #DDD" }}>
            <Text style={styles.tableColHeader}>Material</Text>
            <Text style={styles.tableColHeader}>Qty</Text>
            <Text style={styles.tableColHeader}>Rate</Text>
            <Text style={{ ...styles.tableColHeader, textAlign: "right" }}>Total Price</Text>
          </View>
          {project?.materials?.map((material, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={styles.tableCol}>{material.name}</Text>
              <Text style={styles.tableCol}>{material.quantity}</Text>
              <Text style={styles.tableCol}>{`$${material.price.toFixed(2)}`}</Text>
              <Text
                style={{ ...styles.tableCol, textAlign: "right" }}
              >{`$${calculateTotalPrice(material.quantity, material.price).toFixed(2)}`}</Text>
            </View>
          ))}
        </View>
        <View style={styles.footer}>
          <Text style={styles.subtotal}>
            SUBTOTAL
          </Text>
          <Text style={styles.subtotal}>${calculateSubtotal(project?.materials)?.toFixed(2)}</Text>
        </View>
      </View>
    </Page>
  </Document>
)

