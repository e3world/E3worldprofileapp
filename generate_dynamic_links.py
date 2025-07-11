#!/usr/bin/env python3
"""
Generate dynamic links from serial codes CSV file.
Reads serial codes and creates unique URLs in the format: https://SerialCode/e3world.co.uk
"""

import csv
import os
import sys
from pathlib import Path

def generate_dynamic_links(input_csv_path, output_csv_path):
    """
    Read serial codes from CSV and generate dynamic links.
    
    Args:
        input_csv_path (str): Path to input CSV file with serial codes
        output_csv_path (str): Path to output CSV file with dynamic links
    """
    
    # Check if input file exists
    if not os.path.exists(input_csv_path):
        print(f"Error: Input file '{input_csv_path}' not found.")
        return False
    
    serial_codes = []
    dynamic_links = []
    
    try:
        # Read the input CSV file
        with open(input_csv_path, 'r', newline='', encoding='utf-8') as csvfile:
            # Try to detect if there's a header and what the delimiter is
            sample = csvfile.read(1024)
            csvfile.seek(0)
            
            # Detect dialect
            try:
                dialect = csv.Sniffer().sniff(sample)
                delimiter = dialect.delimiter
            except:
                delimiter = ','
            
            reader = csv.reader(csvfile, delimiter=delimiter)
            
            # Read all rows
            rows = list(reader)
            
            # Check if first row looks like a header
            if rows and len(rows) > 1:
                first_row = rows[0]
                # If first row contains common header terms, skip it
                if any(term.lower() in str(first_row[0]).lower() for term in ['serial', 'code', 'id', 'tag']):
                    print(f"Detected header row: {first_row}")
                    rows = rows[1:]
            
            # Process each row
            for i, row in enumerate(rows):
                if row and len(row) > 0:
                    serial_code = str(row[0]).strip()
                    if serial_code:  # Only process non-empty serial codes
                        # Generate dynamic link
                        dynamic_link = f"https://{serial_code}/e3world.co.uk"
                        
                        serial_codes.append(serial_code)
                        dynamic_links.append(dynamic_link)
                        
                        print(f"Processed: {serial_code} -> {dynamic_link}")
    
    except Exception as e:
        print(f"Error reading input file: {e}")
        return False
    
    # Write output CSV file
    try:
        with open(output_csv_path, 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.writer(csvfile)
            
            # Write header
            writer.writerow(['SerialCode', 'DynamicLink'])
            
            # Write data rows
            for serial_code, dynamic_link in zip(serial_codes, dynamic_links):
                writer.writerow([serial_code, dynamic_link])
        
        print(f"\nSuccess! Generated {len(serial_codes)} dynamic links.")
        print(f"Output saved to: {output_csv_path}")
        
        # Show first few examples
        if serial_codes:
            print("\nFirst 5 examples:")
            for i in range(min(5, len(serial_codes))):
                print(f"  {serial_codes[i]} -> {dynamic_links[i]}")
        
        return True
        
    except Exception as e:
        print(f"Error writing output file: {e}")
        return False

def main():
    print("Dynamic Link Generator for NFT Serial Codes")
    print("=" * 50)
    
    # Default file paths
    input_file = "serial_codes.csv"
    output_file = "dynamic_links.csv"
    
    # Check if input file exists in current directory
    if not os.path.exists(input_file):
        print(f"Looking for CSV file with serial codes...")
        
        # Look for any CSV files in the current directory
        csv_files = list(Path('.').glob('*.csv'))
        
        if csv_files:
            print(f"Found CSV files: {[f.name for f in csv_files]}")
            input_file = str(csv_files[0])
            print(f"Using: {input_file}")
        else:
            print("No CSV files found in current directory.")
            print("Please ensure your CSV file is in the same directory as this script.")
            print("Expected format: CSV file with serial codes in the first column.")
            return
    
    # Generate dynamic links
    success = generate_dynamic_links(input_file, output_file)
    
    if success:
        print(f"\nTask completed successfully!")
        print(f"Input file: {input_file}")
        print(f"Output file: {output_file}")
    else:
        print("Task failed. Please check the error messages above.")

if __name__ == "__main__":
    main()