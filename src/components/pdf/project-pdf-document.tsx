import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { Material, Project } from '@/types'

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#002D62',
    paddingBottom: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#002D62',
  },
  subtitle: {
    fontSize: 12,
    color: '#E50050',
    fontWeight: 'bold',
  },
  text: {
    marginBottom: 5,
  },
  section: {
    marginBottom: 20,
  },
  table: {
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '25%',
    backgroundColor: '#F2F2F2',
    padding: 5,
    fontWeight: 'bold',
  },
  tableCol: {
    width: '25%',
    padding: 5,
    borderBottomWidth: 1,
    borderColor: '#DDD',
  },
  subtotal: {
    textAlign: 'right',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E50050',
    marginTop: 10,
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
        <Text style={styles.title}>Viva Landscape & Design</Text>
        <Text>Glendale, AZ, United States, Arizona</Text>
      </View>
      <Text style={styles.subtitle}>Submitted on: February 25, 2025</Text>
      <View style={styles.section}>
        <Text style={styles.text}>Client: {project?.clientName}</Text>
        <Text style={styles.text}>Due Date: {project?.dueDate}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>Project Details</Text>
      </View>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableColHeader}>Description</Text>
          <Text style={styles.tableColHeader}>Qty</Text>
          <Text style={styles.tableColHeader}>Rate</Text>
          <Text style={styles.tableColHeader}>Total Price</Text>
        </View>
        {project?.materials?.map((material, index) => (
          <View style={styles.tableRow} key={index}>
            <Text style={styles.tableCol}>{material.name}</Text>
            <Text style={styles.tableCol}>{material.quantity}</Text>
            <Text style={styles.tableCol}>{`$${material.price.toFixed(2)}`}</Text>
            <Text
              style={styles.tableCol}
            >{`$${calculateTotalPrice(material.quantity, material.price).toFixed(2)}`}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.subtotal}>
        Subtotal: ${calculateSubtotal(project?.materials)?.toFixed(2)}
      </Text>
    </Page>
  </Document>
)
