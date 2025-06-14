/**
 * End-to-end tests for the payment flow
 * Run these tests with: npm run test:e2e
 */

import { test, expect } from '@playwright/test';

// Test the basic payment flow
test('complete payment flow', async ({ page }) => {
  // Step 1: Admin sets required plan for a patient
  await page.goto('/admin/dashboard');
  
  // Log in as admin
  await page.fill('input[type="password"]', 'admin-test-password');
  await page.click('button[type="submit"]');
  
  // Wait for the dashboard to load
  await page.waitForSelector('h1:has-text("Payment Management Dashboard")');
  
  // Find a patient and click Show Details
  await page.click('button:has-text("Show Details")');
  
  // Set the required plan to standard
  await page.getByText('In-Depth Analysis (€99)').click();
  await page.click('button:has-text("Set Required Plan")');
  
  // Wait for success message
  await page.waitForSelector('text=Successfully set standard plan');
  
  // Step 2: Patient views required plan and initiates payment
  await page.goto(`/alola/${testPatientId}`);
  
  // Check that the required plan is displayed
  await expect(page.locator('text=In-Depth Analysis')).toBeVisible();
  
  // Click the payment button
  await page.click('button:has-text("Pay €99")');
  
  // Verify payment link is generated
  await page.waitForSelector('text=Your payment link is ready');
  await expect(page.locator('a:has-text("Complete Your Payment")')).toBeVisible();
  
  // Step 3: Simulate a successful payment
  await page.goto('/test/payment');
  
  // Select the same patient
  await page.selectOption('select#patientSelect', testPatientId);
  
  // Select standard plan
  await page.selectOption('select#planSelect', 'standard');
  
  // Submit the simulation form
  await page.click('button:has-text("Simulate Payment")');
  
  // Wait for success message
  await page.waitForSelector('text=Payment simulation successful');
  
  // Step 4: Verify patient can access their report
  await page.goto(`/alola/${testPatientId}`);
  
  // Check for payment confirmation message
  await expect(page.locator('text=Payment Confirmed')).toBeVisible();
  
  // Check for report access button
  await expect(page.locator('a:has-text("View Your Medical Report")')).toBeVisible();
});

// Test the admin payment notification
test('admin receives payment notification', async ({ page }) => {
  // Log in as admin
  await page.goto('/admin/dashboard');
  await page.fill('input[type="password"]', 'admin-test-password');
  await page.click('button[type="submit"]');
  
  // Find the patient who just paid (should show as Paid)
  await page.waitForSelector(`text=${testPatientId}`);
  
  // Check that the payment status shows as Paid
  const paymentStatusCell = page.locator(`tr:has-text("${testPatientId}") >> td:nth-child(5)`);
  await expect(paymentStatusCell.locator('text=Paid')).toBeVisible();
  
  // Expand the patient details
  await page.click(`tr:has-text("${testPatientId}") >> button:has-text("Show Details")`);
  
  // Verify payment details are present
  await expect(page.locator('text=Payment Details')).toBeVisible();
  await expect(page.locator('dd:has-text("Paid")')).toBeVisible();
});

// You'll need to set up a test patient ID before running these tests
const testPatientId = 'test-patient-id'; // Replace with an actual test patient ID
