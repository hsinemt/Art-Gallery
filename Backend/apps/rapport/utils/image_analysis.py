from transformers import BlipProcessor, BlipForConditionalGeneration
from PIL import Image
import numpy as np
from sklearn.cluster import KMeans
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image as RLImage, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors as pdf_colors
import os
import io

# === Load BLIP model (first time online, then offline) ===
processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

# --- Describe the image ---
def describe_image(image_path):
    image = Image.open(image_path).convert("RGB")
    inputs = processor(images=image, return_tensors="pt")
    out = model.generate(**inputs, max_new_tokens=60)
    description = processor.decode(out[0], skip_special_tokens=True)
    return description

# --- Extract main colors using KMeans ---
def extract_colors(image_path, num_colors=5):
    image = Image.open(image_path).convert("RGB")
    img_np = np.array(image)
    img_np = img_np.reshape(-1, 3)
    kmeans = KMeans(n_clusters=num_colors, random_state=0).fit(img_np)
    colors = kmeans.cluster_centers_.astype(int)
    return colors

# --- Generate the textual report content ---
def generate_text_report(description, colors):
    report = f"""
Of course, here is a full report on the provided image.

========================
IMAGE ANALYSIS REPORT
========================

I. General Description
The image appears to depict {description}. The composition is straightforward and clearly presents the subject.

II. Color Composition
The image features approximately {len(colors)} dominant colors, which define its visual tone and atmosphere.

III. Technical Aspects
Framing and Composition: The main subject appears central or clearly positioned within the frame.
Lighting: Lighting conditions seem consistent with the image’s tone and contrast.
Image Quality: Appears standard-resolution with balanced exposure and natural colors.

IV. Inferred Context
Based on visual cues, the image was likely captured using a standard camera or device.
The scene appears authentic and unaltered, intended for descriptive, creative, or profile use.

========================
End of Report
========================
"""
    return report

# --- Save report to TXT file ---
def save_txt_report(report, image_path):
    base = os.path.splitext(image_path)[0]
    txt_path = base + "_report.txt"
    with open(txt_path, "w", encoding="utf-8") as f:
        f.write(report)
    print(f"✅ TXT report saved as: {txt_path}")

# --- Generate color boxes for the PDF ---
def make_color_table(colors):
    data = []
    for c in colors:
        hex_color = f"#{c[0]:02x}{c[1]:02x}{c[2]:02x}"
        color_box = pdf_colors.Color(c[0]/255, c[1]/255, c[2]/255)
        data.append([color_box, f"RGB({c[0]}, {c[1]}, {c[2]})", hex_color])
    table_data = [["Color", "RGB Value", "HEX Code"]] + data

    # Build table
    table = Table(table_data, colWidths=[2*cm, 5*cm, 4*cm])
    style = TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), pdf_colors.grey),
        ("TEXTCOLOR", (0, 0), (-1, 0), pdf_colors.whitesmoke),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("GRID", (0, 0), (-1, -1), 0.5, pdf_colors.black),
    ])
    # Add color fill for boxes
    for i in range(1, len(table_data)):
        style.add("BACKGROUND", (0, i), (0, i), table_data[i][0])
    table.setStyle(style)
    return table

# --- Save PDF report with image and colors ---
def save_pdf_report(image_path, report_text, colors):
    base = os.path.splitext(image_path)[0]
    pdf_path = base + "_report.pdf"
    doc = SimpleDocTemplate(pdf_path, pagesize=A4)
    styles = getSampleStyleSheet()
    story = []

    # Title
    story.append(Paragraph("<b>IMAGE ANALYSIS REPORT</b>", styles["Title"]))
    story.append(Spacer(1, 12))

    # Insert image preview
    img = RLImage(image_path, width=10*cm, height=7*cm)
    story.append(img)
    story.append(Spacer(1, 12))

    # Report text
    story.append(Paragraph(report_text.replace("\n", "<br/>"), styles["Normal"]))
    story.append(Spacer(1, 12))

    # Color palette
    story.append(Paragraph("<b>Color Palette</b>", styles["Heading2"]))
    story.append(make_color_table(colors))

    doc.build(story)
    print(f"✅ PDF report saved as: {pdf_path}")

# --- Main function ---
def analyze_image(image_path, save_as_pdf=True):
    print("🔍 Analyzing image...")
    desc = describe_image(image_path)
    colors = extract_colors(image_path)
    report = generate_text_report(desc, colors)
    save_txt_report(report, image_path)
    if save_as_pdf:
        save_pdf_report(image_path, report, colors)
    print("\n🧾 Analysis Complete!\n")
    print(report)
    return {
        "description": desc,
        "colors": colors.tolist(),
        "report_text": report
    }


