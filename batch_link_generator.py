#!/usr/bin/env python3
"""
Advanced batch dynamic link generator for NFT serial codes.
Handles large datasets (200+ codes) with progress tracking and validation.
"""

import csv
import os
import sys
import re
from pathlib import Path
import argparse
from datetime import datetime

class DynamicLinkGenerator:
    def __init__(self, input_file, output_file=None, url_template=None):
        self.input_file = input_file
        self.output_file = output_file or "dynamic_links_output.csv"
        self.url_template = url_template or "https://{serial_code}/e3world.co.uk"
        self.processed_count = 0
        self.errors = []
        
    def validate_serial_code(self, serial_code):
        """Validate serial code format (alphanumeric, no spaces)"""
        if not serial_code or not serial_code.strip():
            return False, "Empty serial code"
        
        # Remove whitespace
        serial_code = serial_code.strip()
        
        # Check for valid characters (alphanumeric + some special chars)
        if not re.match(r'^[A-Za-z0-9\-_]+$', serial_code):
            return False, f"Invalid characters in serial code: {serial_code}"
            
        return True, serial_code
    
    def generate_dynamic_link(self, serial_code):
        """Generate dynamic link from serial code"""
        try:
            # Validate serial code
            is_valid, result = self.validate_serial_code(serial_code)
            if not is_valid:
                return None, result
            
            clean_serial = result
            
            # Generate URL
            dynamic_link = self.url_template.format(serial_code=clean_serial)
            
            return dynamic_link, None
            
        except Exception as e:
            return None, f"Error generating link: {str(e)}"
    
    def read_input_file(self):
        """Read and parse input CSV file"""
        if not os.path.exists(self.input_file):
            raise FileNotFoundError(f"Input file not found: {self.input_file}")
        
        serial_codes = []
        
        with open(self.input_file, 'r', newline='', encoding='utf-8') as csvfile:
            # Auto-detect CSV format
            sample = csvfile.read(1024)
            csvfile.seek(0)
            
            try:
                dialect = csv.Sniffer().sniff(sample)
                delimiter = dialect.delimiter
            except:
                delimiter = ','
            
            reader = csv.reader(csvfile, delimiter=delimiter)
            rows = list(reader)
            
            if not rows:
                raise ValueError("Input file is empty")
            
            # Handle header row
            start_row = 0
            if len(rows) > 1:
                first_row = rows[0]
                if any(term.lower() in str(first_row[0]).lower() 
                      for term in ['serial', 'code', 'id', 'tag', 'number']):
                    print(f"Detected header: {first_row[0]}")
                    start_row = 1
            
            # Extract serial codes
            for i, row in enumerate(rows[start_row:], start_row + 1):
                if row and len(row) > 0:
                    serial_code = str(row[0]).strip()
                    if serial_code:
                        serial_codes.append((serial_code, i))
        
        return serial_codes
    
    def process_batch(self):
        """Process all serial codes and generate links"""
        print(f"Reading input file: {self.input_file}")
        
        try:
            serial_codes = self.read_input_file()
            print(f"Found {len(serial_codes)} serial codes to process")
            
            if len(serial_codes) == 0:
                print("No valid serial codes found in input file")
                return False
            
            results = []
            
            # Process each serial code
            for serial_code, row_num in serial_codes:
                dynamic_link, error = self.generate_dynamic_link(serial_code)
                
                if error:
                    self.errors.append(f"Row {row_num}: {error}")
                    print(f"Error processing '{serial_code}': {error}")
                    continue
                
                results.append((serial_code, dynamic_link))
                self.processed_count += 1
                
                # Progress indicator for large batches
                if self.processed_count % 50 == 0:
                    print(f"Processed {self.processed_count} codes...")
            
            # Write output file
            if results:
                self.write_output_file(results)
                return True
            else:
                print("No valid links generated")
                return False
                
        except Exception as e:
            print(f"Error processing batch: {e}")
            return False
    
    def write_output_file(self, results):
        """Write results to output CSV file"""
        try:
            with open(self.output_file, 'w', newline='', encoding='utf-8') as csvfile:
                writer = csv.writer(csvfile)
                
                # Write header
                writer.writerow(['SerialCode', 'DynamicLink'])
                
                # Write data
                for serial_code, dynamic_link in results:
                    writer.writerow([serial_code, dynamic_link])
            
            print(f"\nOutput saved to: {self.output_file}")
            
        except Exception as e:
            print(f"Error writing output file: {e}")
            raise
    
    def print_summary(self):
        """Print processing summary"""
        print("\n" + "="*60)
        print("PROCESSING SUMMARY")
        print("="*60)
        print(f"Input file: {self.input_file}")
        print(f"Output file: {self.output_file}")
        print(f"Successfully processed: {self.processed_count} codes")
        print(f"Errors encountered: {len(self.errors)}")
        
        if self.errors:
            print(f"\nErrors:")
            for error in self.errors[:10]:  # Show first 10 errors
                print(f"  - {error}")
            if len(self.errors) > 10:
                print(f"  ... and {len(self.errors) - 10} more errors")
        
        print(f"\nGenerated {self.processed_count} dynamic links successfully!")

def main():
    parser = argparse.ArgumentParser(description='Generate dynamic links from NFT serial codes')
    parser.add_argument('input_file', nargs='?', help='Input CSV file with serial codes')
    parser.add_argument('-o', '--output', help='Output CSV file name')
    parser.add_argument('-t', '--template', help='URL template (default: https://{serial_code}/e3world.co.uk)')
    
    args = parser.parse_args()
    
    # Find input file
    input_file = args.input_file
    if not input_file:
        # Look for CSV files in current directory
        csv_files = list(Path('.').glob('*.csv'))
        if csv_files:
            input_file = str(csv_files[0])
            print(f"Using found CSV file: {input_file}")
        else:
            print("No CSV file specified and none found in current directory")
            print("Usage: python3 batch_link_generator.py <input_file.csv>")
            return
    
    # Set up generator
    output_file = args.output or f"dynamic_links_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
    url_template = args.template or "https://{serial_code}/e3world.co.uk"
    
    generator = DynamicLinkGenerator(input_file, output_file, url_template)
    
    print("NFT Dynamic Link Generator")
    print("="*60)
    print(f"URL Template: {url_template}")
    print(f"Output will be saved to: {output_file}")
    print()
    
    # Process the batch
    success = generator.process_batch()
    
    # Print summary
    generator.print_summary()
    
    if success:
        print(f"\n✅ Task completed successfully!")
        
        # Show first few examples
        if generator.processed_count > 0:
            print(f"\nFirst few examples:")
            try:
                with open(output_file, 'r') as f:
                    reader = csv.reader(f)
                    next(reader)  # Skip header
                    for i, row in enumerate(reader):
                        if i >= 5:  # Show first 5
                            break
                        print(f"  {row[0]} -> {row[1]}")
            except:
                pass
    else:
        print(f"\n❌ Task failed - check error messages above")

if __name__ == "__main__":
    main()