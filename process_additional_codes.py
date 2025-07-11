#!/usr/bin/env python3
"""
Process additional serial codes and generate dynamic links
"""

import csv
from datetime import datetime

# Additional serial codes from the CSV file
additional_codes = [
    "E00378", "E00379", "E00380", "E00381", "E00382", "E00383", "E00384", "E00385", "E00386", "E00387",
    "E00388", "E00389", "E00390", "E00391", "E00392", "E00393", "E00394", "E00395", "E00396", "E00397",
    "E00398", "E00399", "E00400", "E00401", "E00402", "E00403", "E00404", "E00405", "E00406", "E00407",
    "E00408", "E00409", "E00410", "E00411", "E00412", "E00413", "E00414", "E00415", "E00416", "E00417",
    "E00418", "E00419", "E00420", "E00421", "E00422", "E00423", "E00424", "E00425", "E00426", "E00427",
    "E00428"
]

def generate_additional_dynamic_links():
    """Generate dynamic links for additional serial codes"""
    print(f"Processing {len(additional_codes)} additional serial codes...")
    
    # Generate dynamic links
    results = []
    for serial_code in additional_codes:
        dynamic_link = f"https://{serial_code}/e3world.co.uk"
        results.append((serial_code, dynamic_link))
    
    # Write to CSV with timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_file = f"additional_nft_dynamic_links_{timestamp}.csv"
    
    with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(['SerialCode', 'DynamicLink'])
        
        for serial_code, dynamic_link in results:
            writer.writerow([serial_code, dynamic_link])
    
    print(f"Successfully generated {len(results)} additional dynamic links!")
    print(f"Output saved to: {output_file}")
    
    # Show first 10 examples
    print("\nFirst 10 examples:")
    for i in range(min(10, len(results))):
        serial_code, dynamic_link = results[i]
        print(f"  {serial_code} -> {dynamic_link}")
    
    # Show last 5 examples
    print("\nLast 5 examples:")
    for i in range(max(0, len(results) - 5), len(results)):
        serial_code, dynamic_link = results[i]
        print(f"  {serial_code} -> {dynamic_link}")
    
    return output_file

if __name__ == "__main__":
    print("Additional NFT Dynamic Link Generator")
    print("=" * 50)
    output_file = generate_additional_dynamic_links()
    print(f"\n✅ Task completed successfully!")
    print(f"Generated file: {output_file}")