import pandas as pd
from sklearn.model_selection import train_test_split
from xgboost import XGBRegressor
import joblib

df=pd.read_csv("ml_datasets.csv")

X=df.drop("expected_return",axis=1)
y=df["expected_return"]

X_train,X_test,y_train,y_test=train_test_split(X,y,test_size=0.2)
model=XGBRegressor()
model.fit(X_train,y_train)
joblib.dump(model,"model.pkl")
print("Model trained and saved.")
