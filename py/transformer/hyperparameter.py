import optuna

def objective(trial):
    # Hyperparameters to optimize
    model_dim = trial.suggest_int("model_dim", 32, 128)
    num_heads = trial.suggest_int("num_heads", 2, 8)
    num_layers = trial.suggest_int("num_layers", 2, 6)
    dropout = trial.suggest_float("dropout", 0.05, 0.3)
    learning_rate = trial.suggest_loguniform("learning_rate", 1e-4, 1e-2)

    # Create model with trial parameters
    model = SDGTransformer(
        input_dim=1,
        model_dim=model_dim,
        num_heads=num_heads,
        num_layers=num_layers,
        dropout=dropout,
    ).to(device)
    
    optimizer = optim.Adam(model.parameters(), lr=learning_rate)
    loss_fn = nn.MSELoss()

    # Train for 10 epochs (to save time)
    train_model(model, train_loader, num_epochs=10)

    # Evaluate performance
    rmse, mae = evaluate_model(model, val_loader)
    
    return rmse  # Minimize RMSE

# Run optimization
study = optuna.create_study(direction="minimize")
study.optimize(objective, n_trials=20)

# Best parameters
best_params = study.best_params
print("Best Hyperparameters:", best_params)

best_model = SDGTransformer(
    input_dim=1,
    model_dim=best_params["model_dim"],
    num_heads=best_params["num_heads"],
    num_layers=best_params["num_layers"],
    dropout=best_params["dropout"],
).to(device)

optimizer = optim.Adam(best_model.parameters(), lr=best_params["learning_rate"])
train_model(best_model, train_loader, num_epochs=50)

torch.save(best_model.state_dict(), "sdg_transformer.pth")
print("Model saved successfully!")

# Load model with the same architecture
loaded_model = SDGTransformer(
    input_dim=1,
    model_dim=best_params["model_dim"],
    num_heads=best_params["num_heads"],
    num_layers=best_params["num_layers"],
    dropout=best_params["dropout"],
).to(device)

loaded_model.load_state_dict(torch.load("sdg_transformer.pth"))
loaded_model.eval()
print("Model loaded successfully!")
