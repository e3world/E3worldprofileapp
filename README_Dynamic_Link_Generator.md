# Dynamic Link Generator for NFT Serial Codes

## Overview
This toolkit generates unique dynamic links for NFT serial codes in the format: `https://SerialCode/e3world.co.uk`

## Files Created
- `generate_dynamic_links.py` - Simple script for basic CSV processing
- `batch_link_generator.py` - Advanced script with validation and error handling
- `sample_serial_codes.csv` - Example input file for testing

## Quick Start

### 1. Prepare Your CSV File
Create a CSV file with your 200 serial codes. The file should have one of these formats:

**With Header:**
```csv
SerialCode
ABC123
DEF456
GHI789
...
```

**Without Header:**
```csv
ABC123
DEF456
GHI789
...
```

### 2. Run the Generator

**Simple Version:**
```bash
python3 generate_dynamic_links.py
```

**Advanced Version:**
```bash
python3 batch_link_generator.py your_serial_codes.csv
```

### 3. Output
The script will generate a CSV file with two columns:
- `SerialCode` - Original serial code
- `DynamicLink` - Generated dynamic link

Example output:
```csv
SerialCode,DynamicLink
ABC123,https://ABC123/e3world.co.uk
DEF456,https://DEF456/e3world.co.uk
GHI789,https://GHI789/e3world.co.uk
```

## Advanced Features

### Command Line Options (batch_link_generator.py)
```bash
# Specify input and output files
python3 batch_link_generator.py input.csv -o output.csv

# Custom URL template
python3 batch_link_generator.py input.csv -t "https://custom.domain.com/{serial_code}/path"

# Help
python3 batch_link_generator.py -h
```

### Features
- ✅ Automatic CSV format detection
- ✅ Header row detection and handling
- ✅ Serial code validation (alphanumeric + hyphens/underscores)
- ✅ Progress tracking for large batches
- ✅ Error reporting and validation
- ✅ Timestamped output files
- ✅ Handles 200+ serial codes efficiently

### Error Handling
The advanced script will:
- Validate serial codes for proper format
- Report invalid codes with row numbers
- Continue processing valid codes even if some fail
- Provide detailed error summary

## Usage Examples

### For Your 200 Serial Codes
1. Place your CSV file in the same directory as the script
2. Run: `python3 batch_link_generator.py your_file.csv`
3. The output will be saved as `dynamic_links_YYYYMMDD_HHMMSS.csv`

### Expected Output Format
For each serial code like `E3W001`, `E3W002`, etc., you'll get:
```csv
SerialCode,DynamicLink
E3W001,https://E3W001/e3world.co.uk
E3W002,https://E3W002/e3world.co.uk
E3W003,https://E3W003/e3world.co.uk
...
```

## Technical Notes
- Supports various CSV formats and delimiters
- Handles files with or without headers
- Validates serial codes to ensure URL compatibility
- Processes large batches efficiently with progress tracking
- Unicode support for international characters

## Troubleshooting

### Common Issues
1. **File not found**: Ensure your CSV file is in the same directory
2. **Invalid serial codes**: Check for special characters or spaces
3. **Empty output**: Verify your CSV has data in the first column

### File Format Requirements
- CSV format (comma-separated values)
- Serial codes in the first column
- One serial code per row
- Alphanumeric characters, hyphens, and underscores only

## Next Steps
1. Place your CSV file with 200 serial codes in this directory
2. Run the batch generator script
3. Review the output file for any errors
4. Use the generated dynamic links for your NFT tags

The tools are ready to process your 200 serial codes and generate the complete list of dynamic links in the required format.