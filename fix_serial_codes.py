#!/usr/bin/env python3
"""
Fix the serial codes CSV processing issue and generate correct dynamic links
"""

import csv

# Your exact serial codes from the file
serial_codes = [
    "EAVO53", "E9RIU3", "ED4ON3", "EDTJB3", "EOVVA3", "EI0QW3", "EULVI3", "EK65D3", "EBUE13", "EKXOR3",
    "EALY33", "EM0IT3", "EGQUW3", "EPJ943", "EUVFW3", "EV5HL3", "EQVOM3", "EOHES3", "EM33B3", "EB3HY3",
    "E664S3", "E70283", "E2UT83", "E6BZY3", "EDQNV3", "EO19O3", "E9CNU3", "EY0H63", "ESQSR3", "EI1OQ3",
    "EJWMX3", "E91OI3", "EPT7F3", "EW95M3", "EMBWP3", "ECM7A3", "EJQV33", "EDB523", "E4GMQ3", "E6QU43",
    "EEAOT3", "EQG573", "E6BMY3", "ENSDG3", "EO9MD3", "ET0ZD3", "EEMTA3", "E2HXD3", "E8RLF3", "EOTEU3",
    "EU7IN3", "E5DG63", "EH2DB3", "ESM9P3", "EPWBN3", "ELDZP3", "EIKY23", "EIFZE3", "EKOGP3", "EKGYA3",
    "EE34G3", "EZNBT3", "EMGOW3", "E6HQH3", "EQB713", "EOGOM3", "E78IL3", "ECTLB3", "EC8YA3", "ENK7Q3",
    "E4F953", "E5HIH3", "E19E53", "EHLH33", "ET9V23", "EO6EU3", "ED7GL3", "EO5HY3", "E3J1A3", "E3BIC3",
    "EX67E3", "EP6HR3", "EDLBI3", "EVQ7T3", "E3O9D3", "EMDCS3", "EQGSV3", "ES9X93", "EFMVW3", "EOBQM3",
    "E9P7G3", "EWK553", "E7WW73", "EKAS13", "E2B8Y3", "EAD733", "ELQQF3", "EZF763", "E41R73", "EJCAG3",
    "E4MSL3", "E0U4O3", "END273", "EXZCV3", "ED3F03", "EBBTO3", "E3CPI3", "EIFZU3", "E5PMN3", "EDXF63",
    "EH79O3", "ET94M3", "EHFFW3", "EHTOW3", "EBNL83", "EOZPW3", "EWWT43", "EPE1L3", "E7KRE3", "E4FNR3",
    "EQRL03", "E9IRN3", "E6RN03", "ENVYH3", "E3BIQ3", "EJ2YV3", "E3GSK3", "E5QPX3", "EKLQN3", "EQDUR3",
    "EH5LZ3", "ECE0M3", "EQW2F3", "EC3NP3", "EU5HM3", "ETE3D3", "EZC373", "EZIG13", "EG6DC3", "EGDXI3",
    "E67023", "EUQD13", "ERVBJ3", "E4V6H3", "ELDPA3", "EU6UB3", "EHA2V3", "EUMPF3", "E00CT3", "E81I03",
    "EQAZI3", "ETNEC3", "EGLYI3", "EU9PP3", "E6FZJ3", "ETKYU3", "E4S8Y3", "EL8033", "EDF283", "EYYD23",
    "EGW2U3", "EOOTY3", "EXFUP3", "ERS2D3", "E58IX3", "EEOWM3", "EH57D3", "EK4R13", "EHBUR3", "EYC543",
    "E4FDG3", "E0RZL3", "EI9W33", "ER0RV3", "E5UR53", "E21LC3", "E1E5P3", "EHEEU3", "E1H3X3", "EIWRB3",
    "E2XWI3", "E6K4F3", "EZOMJ3", "EKG5D3", "EPKJP3", "ETLBK3", "ES6F33", "EPOMY3", "EZRXN3", "EZ55G3",
    "E9PQY3", "EO6RS3", "EXDFK3", "EPDCC3", "EF6NA3", "ELDN03", "EHJI33", "ELIIA3", "EZGGL3", "E44I13"
]

def generate_dynamic_links():
    """Generate dynamic links for all serial codes"""
    print(f"Processing {len(serial_codes)} serial codes...")
    
    # Generate dynamic links
    results = []
    for serial_code in serial_codes:
        dynamic_link = f"https://{serial_code}/e3world.co.uk"
        results.append((serial_code, dynamic_link))
    
    # Write to CSV
    output_file = "correct_nft_dynamic_links.csv"
    with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(['SerialCode', 'DynamicLink'])
        
        for serial_code, dynamic_link in results:
            writer.writerow([serial_code, dynamic_link])
    
    print(f"Successfully generated {len(results)} dynamic links!")
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
    print("Correct NFT Dynamic Link Generator")
    print("=" * 50)
    output_file = generate_dynamic_links()
    print(f"\n✅ Task completed successfully!")
    print(f"Generated file: {output_file}")