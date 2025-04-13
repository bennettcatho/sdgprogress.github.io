def estimate_sdg_completion(model, country_name, sdg_name, history):
    model.eval()
    year = 2023
    country = torch.tensor(dataset.country_dict[country_name], dtype=torch.long).unsqueeze(0).to(device)
    sdg = torch.tensor(dataset.sdg_dict[sdg_name], dtype=torch.long).unsqueeze(0).to(device)
    history = torch.tensor(history, dtype=torch.float32).unsqueeze(0).to(device)

    while True:
        pred = model(country, sdg, history).item()
        if pred >= 1.0:  # 100% attainment (normalized)
            return year
        history = torch.cat((history[:, 1:], torch.tensor([[pred]]).to(device)), dim=1)
        year += 1
        if year > 2100:  # Avoid infinite loops
            return "Not achievable by 2100"

# Example
completion_year = estimate_sdg_completion(model, "USA", "SDG 1", history)
print(f"SDG 1 in USA will reach 100% in the year: {completion_year}")
