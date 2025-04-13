from sklearn.metrics import mean_absolute_error, mean_squared_error

def evaluate_model(model, data_loader):
    model.eval()
    preds, actuals = [], []

    with torch.no_grad():
        for country, sdg, history, target in data_loader:
            country, sdg, history, target = country.to(device), sdg.to(device), history.to(device), target.to(device)
            pred = model(country, sdg, history).squeeze()
            preds.extend(pred.cpu().numpy())
            actuals.extend(target.cpu().numpy())

    rmse = np.sqrt(mean_squared_error(actuals, preds))
    mae = mean_absolute_error(actuals, preds)
    print(f"Evaluation - RMSE: {rmse:.4f}, MAE: {mae:.4f}")

# Create validation DataLoader and evaluate
val_loader = create_dataloader(df, batch_size=32, seq_length=10)
evaluate_model(model, val_loader)
