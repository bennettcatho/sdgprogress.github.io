def train_model(model, train_loader, num_epochs=50):
    model.train()
    for epoch in range(num_epochs):
        total_loss = 0
        for country, sdg, history, target in train_loader:
            country, sdg, history, target = country.to(device), sdg.to(device), history.to(device), target.to(device)
            optimizer.zero_grad()
            pred = model(country, sdg, history)
            loss = loss_fn(pred.squeeze(), target)
            loss.backward()
            optimizer.step()
            total_loss += loss.item()
        print(f"Epoch {epoch+1}/{num_epochs}, Loss: {total_loss / len(train_loader)}")

# Initialize Model & Training
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = SDGTransformer(input_dim=1, model_dim=64, num_heads=4, num_layers=3).to(device)
optimizer = optim.Adam(model.parameters(), lr=0.001)
loss_fn = nn.MSELoss()

train_model(model, train_loader, num_epochs=50)
