#!/usr/bin/env python3
"""
Combine all serial codes into a single comprehensive file
"""

import csv
from datetime import datetime

# Original 200 serial codes
original_codes = [
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

# Additional 51 serial codes
additional_codes = [
    "E00378", "E00379", "E00380", "E00381", "E00382", "E00383", "E00384", "E00385", "E00386", "E00387",
    "E00388", "E00389", "E00390", "E00391", "E00392", "E00393", "E00394", "E00395", "E00396", "E00397",
    "E00398", "E00399", "E00400", "E00401", "E00402", "E00403", "E00404", "E00405", "E00406", "E00407",
    "E00408", "E00409", "E00410", "E00411", "E00412", "E00413", "E00414", "E00415", "E00416", "E00417",
    "E00418", "E00419", "E00420", "E00421", "E00422", "E00423", "E00424", "E00425", "E00426", "E00427",
    "E00428"
]

def combine_all_codes():
    """Combine all serial codes into a comprehensive file"""
    all_codes = original_codes + additional_codes
    
    print(f"Combining {len(original_codes)} original codes + {len(additional_codes)} additional codes")
    print(f"Total: {len(all_codes)} serial codes")
    
    # Generate dynamic links for all codes
    results = []
    for serial_code in all_codes:
        dynamic_link = f"https://{serial_code}/e3world.co.uk"
        results.append((serial_code, dynamic_link))
    
    # Write to comprehensive CSV with timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_file = f"complete_nft_dynamic_links_{timestamp}.csv"
    
    with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(['SerialCode', 'DynamicLink'])
        
        for serial_code, dynamic_link in results:
            writer.writerow([serial_code, dynamic_link])
    
    print(f"Successfully generated {len(results)} complete dynamic links!")
    print(f"Output saved to: {output_file}")
    
    # Show summary
    print("\n📊 Summary:")
    print(f"Original serial codes: {len(original_codes)}")
    print(f"Additional serial codes: {len(additional_codes)}")
    print(f"Total dynamic links: {len(results)}")
    
    # Show first few examples from each batch
    print("\nFirst 5 original codes:")
    for i in range(5):
        serial_code, dynamic_link = results[i]
        print(f"  {serial_code} -> {dynamic_link}")
    
    print("\nFirst 5 additional codes:")
    start_idx = len(original_codes)
    for i in range(start_idx, min(start_idx + 5, len(results))):
        serial_code, dynamic_link = results[i]
        print(f"  {serial_code} -> {dynamic_link}")
    
    return output_file

if __name__ == "__main__":
    print("Complete NFT Dynamic Link Generator")
    print("=" * 50)
    output_file = combine_all_codes()
    print(f"\n✅ All serial codes processed successfully!")
    print(f"Complete file: {output_file}")