variable "cidr_block" {
  type    = string
  default = "10.0.0.0/16"
  description = "The CIDR block for the VPC."
}

variable "vpc_name" {
  type    = string
  description = "The name of the VPC."
}

variable "azs" {
  type    = list(string)
  default = ["us-east-1a", "us-east-1b"]
  description = "A list of availability zones to create subnets in."
}

variable "subnet_cidr_blocks" {
  type = list(string)
  default = ["10.0.1.0/24", "10.0.2.0/24"]
  description = "A list of CIDR blocks for the subnets."
}
