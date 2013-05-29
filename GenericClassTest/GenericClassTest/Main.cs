using System;

namespace GenericClassTest
{
	class MainClass
	{
		public static void Main (string[] args)
		{
			Test<int> test1 = new Test<int> (5);

			test1.Data = 1;

			Console.WriteLine (test1.Data);

		}
	}


	class Test<T>
	{
		T _value;


		public T Data
		{
			get
			{
				return _value;
			}

			set
			{
				_value = value;
			}
		}

		public Test(T t)
		{
			// The field has the same type as the parameter.
			this._value = t;
		}

		public void Write()
		{
			Console.WriteLine(this._value);
		}
	} 

}
